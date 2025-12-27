(function () {
    'use strict';

    const ratingCache = {
        caches: {},
        get(source, key) {
            const cache = this.caches[source] || (this.caches[source] = Lampa.Storage.cache(source, 500, {}));
            const data = cache[key];
            if (!data) return null;
            if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
                delete cache[key];
                Lampa.Storage.set(source, cache);
                return null;
            }
            return data;
        },
        set(source, key, value) {
            if (value.rating === 0 || value.rating === '0.0') return value;
            const cache = this.caches[source] || (this.caches[source] = Lampa.Storage.cache(source, 500, {}));
            value.timestamp = Date.now();
            cache[key] = value;
            Lampa.Storage.set(source, cache);
            return value;
        }
    };

    let taskQueue = [];
    let isProcessing = false;
    const taskInterval = 300;
    let requestPool = [];

    function getRequest() {
        return requestPool.pop() || new Lampa.Reguest();
    }

    function releaseRequest(request) {
        request.clear();
        if (requestPool.length < 3) requestPool.push(request);
    }

    function processQueue() {
        if (isProcessing || !taskQueue.length) return;
        isProcessing = true;
        const task = taskQueue.shift();
        task.execute();
        setTimeout(() => {
            isProcessing = false;
            processQueue();
        }, taskInterval);
    }

    function addToQueue(task) {
        taskQueue.push({ execute: task });
        processQueue();
    }

    function calculateLampaRating10(reactions) {
        let weightedSum = 0;
        let totalCount = 0;
        let reactionCnt = {};
        const reactionCoef = { fire: 5, nice: 4, think: 3, bore: 2, shit: 1 };
        reactions.forEach(item => {
            const count = parseInt(item.counter, 10) || 0;
            const coef = reactionCoef[item.type] || 0;
            weightedSum += count * coef;
            totalCount += count;
            reactionCnt[item.type] = (reactionCnt[item.type] || 0) + count;
        });
        if (totalCount === 0) return { rating: 0, medianReaction: '' };
        const avgRating = weightedSum / totalCount;
        const rating10 = (avgRating - 1) * 2.5;
        const finalRating = rating10 >= 0 ? parseFloat(rating10.toFixed(1)) : 0;
        let medianReaction = '';
        const medianIndex = Math.ceil(totalCount / 2.0);
        const sortedReactions = Object.entries(reactionCoef)
            .sort((a, b) => a[1] - b[1])
            .map(r => r[0]);
        let cumulativeCount = 0;
        while (sortedReactions.length && cumulativeCount < medianIndex) {
            medianReaction = sortedReactions.pop();
            cumulativeCount += (reactionCnt[medianReaction] || 0);
        }
        return { rating: finalRating, medianReaction: medianReaction };
    }

    function fetchLampaRating(ratingKey) {
        return new Promise((resolve) => {
            const request = getRequest();
            let url = "https://cubnotrip.top/api/reactions/get/" + ratingKey;
            request.timeout(10000);
            request.silent(url, (data) => {
                try {
                    if (data && data.result && Array.isArray(data.result)) {
                        let result = calculateLampaRating10(data.result);
                        resolve(result);
                    } else {
                        resolve({ rating: 0, medianReaction: '' });
                    }
                } catch {
                    resolve({ rating: 0, medianReaction: '' });
                } finally {
                    releaseRequest(request);
                }
            }, () => {
                releaseRequest(request);
                resolve({ rating: 0, medianReaction: '' });
            }, false);
        });
    }

    async function getLampaRating(ratingKey) {
        const cached = ratingCache.get('lampa_rating', ratingKey);
        if (cached) return cached;
        try {
            let result = await fetchLampaRating(ratingKey);
            return ratingCache.set('lampa_rating', ratingKey, result);
        } catch {
            return { rating: 0, medianReaction: '' };
        }
    }

    function insertLampaBlock(render) {
        if (!render) return false;
        let rateLine = $(render).find('.full-start-new__rate-line');
        if (rateLine.length === 0) return false;
        if (rateLine.find('.rate--lampa').length > 0) return true;
        let lampaBlockHtml = '<div class="full-start__rate rate--lampa">' +
            '<div class="rate-value">0.0</div>' +
            '<div class="rate-icon"></div>' +
            '<div class="source--name">LAMPA</div>' +
            '</div>';
        let kpBlock = rateLine.find('.rate--kp');
        if (kpBlock.length > 0) {
            kpBlock.after(lampaBlockHtml);
        } else {
            rateLine.append(lampaBlockHtml);
        }
        return true;
    }

    function insertCardRating(card, event) {
        let voteEl = card.querySelector('.card__vote');
        if (!voteEl) {
            voteEl = document.createElement('div');
            voteEl.className = 'card__vote rate--lampa';
            voteEl.style.cssText = `
                position: absolute;
                right: 0.3em;
                bottom: 0.3em;
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                padding: 0.2em 0.5em;
                border-radius: 1em;
                display: flex;
                align-items: center;
                font-size: 0.9em;
                z-index: 10;
            `;
            const parent = card.querySelector('.card__view') || card;
            parent.appendChild(voteEl);
        } else {
            voteEl.innerHTML = '';
        }

        let data = card.dataset || {};
        let cardData = event.object.data || {};
        let id = cardData.id || data.id || card.getAttribute('data-id') || '0';
        let type = (cardData.seasons || cardData.number_of_seasons || cardData.first_air_date) ? 'tv' : 'movie';
        let ratingKey = type + "_" + id;
        voteEl.dataset.movieId = id.toString();

        const cached = ratingCache.get('lampa_rating', ratingKey);
        if (cached && cached.rating > 0) {
            updateVoteEl(voteEl, cached);
            return;
        }

        addToQueue(() => {
            getLampaRating(ratingKey).then(result => {
                if (voteEl.isConnected && voteEl.dataset.movieId === id.toString()) {
                    if (result.rating > 0) {
                        updateVoteEl(voteEl, result);
                    } else {
                        voteEl.style.display = 'none';
                    }
                }
            });
        });
    }

    function updateVoteEl(el, result) {
        let html = result.rating;
        if (result.medianReaction) {
            let src = 'https://cubnotrip.top/img/reactions/' + result.medianReaction + '.svg';
            html += ` <img style="width:1em;height:1em;margin-left:0.3em;vertical-align:middle;" src="${src}">`;
        }
        el.innerHTML = html;
    }

    // === ЗАМЕНА РЕЙТИНГА В EXPLORER-КАРТОЧКАХ НА LAMPA ===
    function replaceExplorerRating(cardElement) {
        let rateBlock = cardElement.querySelector('.explorer-card__head-rate');
        if (!rateBlock) return;

        // Если уже заменили — выходим
        if (rateBlock.dataset.lampaProcessed === 'true') return;

        // Скрываем оригинальный рейтинг TMDB/KP
        let originalSvg = rateBlock.querySelector('svg');
        if (originalSvg) originalSvg.style.display = 'none';
        let originalSpan = rateBlock.querySelector('span');
        if (originalSpan) originalSpan.style.display = 'none';

        // Создаём новый элемент для рейтинга Lampa
        let lampaEl = document.createElement('div');
        lampaEl.className = 'lampa-rating';
        lampaEl.style.cssText = `
            font-weight: bold;
            font-size: 1.2em;
            display: inline-flex;
            align-items: center;
            gap: 0.4em;
            color: #fff;
            text-shadow: 0 0 5px rgba(0,0,0,0.8);
        `;
        rateBlock.appendChild(lampaEl);

        // Помечаем как обработанный
        rateBlock.dataset.lampaProcessed = 'true';

        // === ПОЛУЧАЕМ ID ===
        let id = null;
        let type = 'movie';

        // 1. Пытаемся из постера
        let img = cardElement.querySelector('.explorer-card__head-img img');
        if (img && img.src) {
            let match = img.src.match(/\/(movie|tv)_(\d+)\.jpg/);
            if (match) {
                type = match[1] === 'movie' ? 'movie' : 'tv';
                id = match[2];
            }
        }

        // 2. Fallback: из data-json (часто есть в explorer)
        if (!id) {
            let jsonAttr = cardElement.getAttribute('data-json');
            if (jsonAttr) {
                try {
                    let data = JSON.parse(jsonAttr);
                    id = data.id || data.movie?.id;
                    if (data.seasons || data.number_of_seasons || data.first_air_date) type = 'tv';
                } catch (e) {}
            }
        }

        if (!id) return;

        let ratingKey = type + "_" + id;

        // Берём из кэша (может быть с другой страницы!)
        const cached = ratingCache.get('lampa_rating', ratingKey);
        if (cached && cached.rating > 0) {
            updateLampaEl(lampaEl, cached);
            return;
        }

        // Если нет — запрашиваем
        addToQueue(() => {
            getLampaRating(ratingKey).then(result => {
                if (lampaEl.isConnected && result.rating > 0) {
                    updateLampaEl(lampaEl, result);
                }
            });
        });
    }

    function updateLampaEl(el, result) {
        let html = result.rating;
        if (result.medianReaction) {
            let src = 'https://cubnotrip.top/img/reactions/' + result.medianReaction + '.svg';
            html += ` <img style="width:1.3em;height:1.3em;vertical-align:middle;" src="${src}" alt="${result.medianReaction}">`;
        }
        el.innerHTML = html;
    }

    function pollCards() {
        // Обычные карточки
        document.querySelectorAll('.card:not([data-lampa-processed])').forEach(card => {
            const data = card.card_data || {};
            if (data && data.id) {
                insertCardRating(card, { object: { data } });
                card.dataset.lampaProcessed = 'true'; // чтобы не повторять
            }
        });

        // Explorer-карточки — замена рейтинга
        document.querySelectorAll('.explorer-card').forEach(card => {
            replaceExplorerRating(card);
        });

        setTimeout(pollCards, 800);
    }

    function setupCardListener() {
        if (window.lampa_listener_extensions) return;
        window.lampa_listener_extensions = true;
        Object.defineProperty(window.Lampa.Card.prototype, 'build', {
            get() { return this._build; },
            set(func) {
                this._build = () => {
                    func.apply(this);
                    Lampa.Listener.send('card', { type: 'build', object: this });
                };
            }
        });
    }

    function initPlugin() {
        const style = document.createElement('style');
        style.textContent = `
            .card__vote { display: flex; align-items: center !important; }
            .explorer-card__head-rate { 
                display: flex; 
                align-items: center; 
                gap: 0.5em;
                min-height: 1.5em;
            }
            .lampa-rating img {
                filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));
            }
        `;
        document.head.appendChild(style);

        setupCardListener();
        pollCards();

        Lampa.Listener.follow('card', e => {
            if (e.type === 'build' && e.object.card) {
                insertCardRating(e.object.card, e);
            }
        });

        Lampa.Listener.follow('full', e => {
            if (e.type === 'complite') {
                let render = e.object.activity.render();
                if (render && insertLampaBlock(render)) {
                    if (e.object.method && e.object.id) {
                        let ratingKey = e.object.method + "_" + e.object.id;
                        const cached = ratingCache.get('lampa_rating', ratingKey);
                        if (cached && cached.rating > 0) {
                            $(render).find('.rate--lampa .rate-value').text(cached.rating);
                            if (cached.medianReaction) {
                                let src = 'https://cubnotrip.top/img/reactions/' + cached.medianReaction + '.svg';
                                $(render).find('.rate--lampa .rate-icon').html(`<img style="width:1em;height:1em;margin:0 0.2em;" src="${src}">`);
                            }
                        } else {
                            addToQueue(() => {
                                getLampaRating(ratingKey).then(result => {
                                    if (result.rating > 0) {
                                        $(render).find('.rate--lampa .rate-value').text(result.rating);
                                        if (result.medianReaction) {
                                            let src = 'https://cubnotrip.top/img/reactions/' + result.medianReaction + '.svg';
                                            $(render).find('.rate--lampa .rate-icon').html(`<img style="width:1em;height:1em;margin:0 0.2em;" src="${src}">`);
                                        }
                                    } else {
                                        $(render).find('.rate--lampa').hide();
                                    }
                                });
                            });
                        }
                    }
                }
            }
        });
    }

    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') initPlugin();
        });
    }
})();
