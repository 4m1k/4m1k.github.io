(function () {
    'use strict';

    if (typeof Lampa === 'undefined') return;

    const LOGO_CACHE_PREFIX = 'logo_cache_adv_';

    function applyLogoCssVars() {
        try {
            const h = Lampa.Storage.get('logo_height', '') || '';
            const root = document.documentElement;
            if (h) {
                root.style.setProperty('--ni-logo-max-h', h);
                root.style.setProperty('--ni-card-logo-h', h);
            } else {
                root.style.removeProperty('--ni-logo-max-h');
                root.style.removeProperty('--ni-card-logo-h');
            }
        } catch (e) {}
    }

    function initLogoSettings() {
        if (window.__adv_logo_settings_ready) return;
        window.__adv_logo_settings_ready = true;

        const add = (cfg) => {
            try { Lampa.SettingsApi.addParam(cfg); } catch (e) {}
        };

        add({
            component: 'interface',
            param: { name: 'logo_glav', type: 'select', values: { 1: 'Скрыть', 0: 'Отображать' }, default: '0' },
            field: { name: 'Логотипы вместо названий', description: 'Отображает логотипы фильмов вместо текста' },
            onChange: () => { Lampa.Controller.toggle('settings_component'); } // простое обновление
        });

        add({
            component: 'interface',
            param: { name: 'logo_lang', type: 'select', values: {
                '': 'Как в Lampa', ru: 'Русский', en: 'English', uk: 'Українська', be: 'Беларуская',
                kz: 'Қазақша', pt: 'Português', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano'
            }, default: '' },
            field: { name: 'Язык логотипа', description: 'Приоритетный язык для поиска логотипа' }
        });

        add({
            component: 'interface',
            param: { name: 'logo_size', type: 'select', values: { w300: 'w300', w500: 'w500', w780: 'w780', original: 'Оригинал' }, default: 'original' },
            field: { name: 'Размер логотипа', description: 'Разрешение загружаемого изображения' }
        });

        add({
            component: 'interface',
            param: { name: 'logo_height', type: 'select', values: {
                '': 'Авто (как в теме)', '2.5em': '2.5em', '3em': '3em', '3.5em': '3.5em', '4em': '4em',
                '5em': '5em', '6em': '6em', '7em': '7em', '8em': '8em', '10vh': '10vh'
            }, default: '' },
            field: { name: 'Высота логотипов', description: 'Максимальная высота логотипов' },
            onChange: applyLogoCssVars
        });

        add({
            component: 'interface',
            param: { name: 'logo_animation_type', type: 'select', values: { js: 'JavaScript', css: 'CSS' }, default: 'css' },
            field: { name: 'Тип анимации логотипов', description: 'Способ анимации логотипов' }
        });

        add({
            component: 'interface',
            param: { name: 'logo_hide_year', type: 'trigger', default: true },
            field: { name: 'Скрывать год и страну', description: 'Переносит информацию в строку деталей при логотипе' }
        });

        add({
            component: 'interface',
            param: { name: 'logo_use_text_height', type: 'trigger', default: false },
            field: { name: 'Логотип по высоте текста', description: 'Размер логотипа равен высоте текста названия' }
        });

        add({
            component: 'interface',
            param: { name: 'logo_clear_cache', type: 'button' },
            field: { name: 'Сбросить кеш логотипов', description: 'Очистка сохранённых изображений' },
            onChange: function () {
                Lampa.Select.show({
                    title: 'Сбросить кеш?',
                    items: [{ title: 'Да', confirm: true }, { title: 'Нет' }],
                    onSelect: (e) => {
                        if (e.confirm) {
                            for (let i = localStorage.length - 1; i >= 0; i--) {
                                const k = localStorage.key(i);
                                if (k && k.startsWith(LOGO_CACHE_PREFIX)) localStorage.removeItem(k);
                            }
                            window.location.reload();
                        } else {
                            Lampa.Controller.toggle('settings_component');
                        }
                    },
                    onBack: () => Lampa.Controller.toggle('settings_component')
                });
            }
        });

        applyLogoCssVars();
    }

    function animateOpacity(el, from, to, duration, done) {
        if (!el) return done && done();
        let start = null;
        const ease = t => 1 - Math.pow(1 - t, 3);
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            el.style.opacity = from + (to - from) * ease(p);
            if (p < 1) requestAnimationFrame(step);
            else if (done) done();
        };
        requestAnimationFrame(step);
    }

    class LogoEngine {
        constructor() { this.pending = {}; }

        enabled() { return Lampa.Storage.get('logo_glav', '0') !== '1'; }

        lang() {
            const forced = Lampa.Storage.get('logo_lang', '') || '';
            const base = forced || Lampa.Storage.get('language', 'en');
            return (base.split('-')[0] || 'en');
        }

        size() { return Lampa.Storage.get('logo_size', 'original'); }

        animationType() { return Lampa.Storage.get('logo_animation_type', 'css'); }

        useTextHeight() { return !!Lampa.Storage.get('logo_use_text_height', false); }

        fixedHeight() { return Lampa.Storage.get('logo_height', ''); }

        cacheKey(type, id, lang) { return `${LOGO_CACHE_PREFIX}${type}_${id}_${lang}`; }

        getLogoUrl(item, cb) {
            if (!item || !item.id || !this.enabled()) return cb && cb(null);

            const source = item.source || 'tmdb';
            if (source !== 'tmdb' && source !== 'cub') return cb && cb(null);

            const type = (item.media_type === 'tv' || item.name) ? 'tv' : 'movie';
            const lang = this.lang();
            const key = this.cacheKey(type, item.id, lang);

            const cached = localStorage.getItem(key);
            if (cached) return cb && cb(cached === 'none' ? null : cached);

            if (this.pending[key]) { this.pending[key].push(cb); return; }
            this.pending[key] = [cb];

            const url = Lampa.TMDB.api(`${type}/${item.id}/images?api_key=${Lampa.TMDB.key()}&include_image_language=${lang},en,null`);

            $.get(url, res => {
                let filePath = null;
                if (res && Array.isArray(res.logos) && res.logos.length) {
                    filePath = res.logos.find(l => l.iso_639_1 === lang)?.file_path ||
                               res.logos.find(l => l.iso_639_1 === 'en')?.file_path ||
                               res.logos[0].file_path;
                }
                if (filePath) {
                    const normalized = filePath.replace('.svg', '.png');
                    const logoUrl = Lampa.TMDB.image(`/t/p/${this.size()}${normalized}`);
                    localStorage.setItem(key, logoUrl);
                    this.flush(key, logoUrl);
                } else {
                    localStorage.setItem(key, 'none');
                    this.flush(key, null);
                }
            }).fail(() => {
                localStorage.setItem(key, 'none');
                this.flush(key, null);
            });
        }

        flush(key, value) {
            const list = this.pending[key] || [];
            delete this.pending[key];
            list.forEach(fn => fn(value));
        }

        setImageSizing(img, heightPx) {
            if (!img) return;
            img.style.height = '';
            img.style.width = '';
            img.style.maxHeight = '';
            img.style.maxWidth = '';
            img.style.objectFit = 'contain';
            img.style.objectPosition = 'left bottom';

            const fixed = this.fixedHeight();
            const useText = this.useTextHeight();

            if (!fixed && useText && heightPx > 0) {
                img.style.height = `${heightPx}px`;
                img.style.width = 'auto';
                img.style.maxWidth = '100%';
                img.style.maxHeight = 'none';
            }
        }

        swapContent(container, newNode) {
            if (!container) return;
            if (container.__logo_timer) clearTimeout(container.__logo_timer);

            const type = this.animationType();
            if (type === 'js') {
                animateOpacity(container, 1, 0, 300, () => {
                    container.innerHTML = '';
                    if (typeof newNode === 'string') container.textContent = newNode;
                    else container.appendChild(newNode);
                    animateOpacity(container, 0, 1, 400);
                });
            } else {
                container.style.transition = 'opacity 0.3s ease';
                container.style.opacity = '0';
                container.__logo_timer = setTimeout(() => {
                    container.__logo_timer = null;
                    container.innerHTML = '';
                    if (typeof newNode === 'string') container.textContent = newNode;
                    else container.appendChild(newNode);
                    container.style.transition = 'opacity 0.4s ease';
                    container.style.opacity = '1';
                }, 150);
            }
        }

        applyToCard(card) {
            if (!card || typeof card.render !== 'function' || !card.data) return;

            const jq = card.render(true);
            const root = jq[0] || jq;
            const view = root.querySelector('.card__view');
            const label = root.querySelector('.card__title');
            if (!view || !label) return;

            const titleText = label.textContent.trim();
            const reqId = (card.__adv_logo_req_id || 0) + 1;
            card.__adv_logo_req_id = reqId;

            const removeLogo = () => {
                const wrap = view.querySelector('.adv-card-logo');
                if (wrap) wrap.remove();
                label.style.display = '';
            };

            if (!this.enabled()) {
                removeLogo();
                return;
            }

            // Измерение высоты текста
            let textHeightPx = 0;
            if (this.useTextHeight() && !this.fixedHeight()) {
                const wasDisplay = label.style.display;
                label.style.visibility = 'hidden';
                label.style.display = '';
                textHeightPx = Math.round(label.getBoundingClientRect().height || 24);
                label.style.visibility = '';
                label.style.display = wasDisplay;
            }

            let wrap = view.querySelector('.adv-card-logo');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'adv-card-logo';
                view.appendChild(wrap);
            }

            this.getLogoUrl(card.data, url => {
                if (card.__adv_logo_req_id !== reqId || !root.isConnected) return;

                if (!url) {
                    removeLogo();
                    return;
                }

                const img = new Image();
                img.className = 'adv-card-logo-img';
                img.alt = titleText;
                img.src = url;
                this.setImageSizing(img, textHeightPx);

                wrap.innerHTML = '';
                wrap.appendChild(img);
                label.style.display = 'none';
            });
        }

        syncFullHead(container, active) {
            if (!container || typeof container.find !== 'function') return;

            const headNode = container.find('.full-start-new__head, .full-start__head');
            const detailsNode = container.find('.full-start-new__details, .full-start__details');
            if (!headNode.length || !detailsNode.length) return;

            const headEl = headNode[0];
            const detailsEl = detailsNode[0];

            let moved = detailsEl.querySelector('.adv-moved-head');
            const wantMove = active && Lampa.Storage.get('logo_hide_year', true);

            if (!wantMove) {
                if (moved) moved.remove();
                headEl.style.display = '';
                return;
            }

            if (moved) {
                headEl.style.display = 'none';
                return;
            }

            const html = headEl.innerHTML.trim();
            if (!html) return;

            const span = document.createElement('span');
            span.className = 'adv-moved-head';
            span.innerHTML = html;

            const sep = document.createElement('span');
            sep.className = 'full-start-new__split adv-moved-sep';
            sep.textContent = '●';

            if (detailsEl.children.length > 0) detailsEl.appendChild(sep);
            detailsEl.appendChild(span);
            headEl.style.display = 'none';
        }

        applyToFull(activity, item) {
            if (!activity || typeof activity.render !== 'function' || !item) return;

            const container = activity.render();
            if (!container || typeof container.find !== 'function') return;

            const titleNode = container.find('.full-start-new__title, .full-start__title');
            if (!titleNode.length) return;

            const titleEl = titleNode[0];
            const titleText = (item.title || item.name || item.original_title || item.original_name || '').trim();

            if (!titleEl.__adv_original_text) titleEl.__adv_original_text = titleText;

            const originalText = titleEl.__adv_original_text;

            if (!this.enabled()) {
                this.syncFullHead(container, false);
                if (titleEl.querySelector('img')) this.swapContent(titleEl, originalText);
                else titleNode.text(originalText);
                return;
            }

            this.syncFullHead(container, false);

            let textHeightPx = 0;
            if (this.useTextHeight() && !this.fixedHeight()) {
                const was = titleNode.text();
                titleNode.text(originalText);
                textHeightPx = Math.round(titleEl.getBoundingClientRect().height);
                titleNode.text(was);
            }

            const reqId = (titleEl.__adv_logo_req_id || 0) + 1;
            titleEl.__adv_logo_req_id = reqId;

            this.getLogoUrl(item, url => {
                if (titleEl.__adv_logo_req_id !== reqId || !titleEl.isConnected) return;

                if (!url) {
                    this.syncFullHead(container, false);
                    this.swapContent(titleEl, originalText);
                    return;
                }

                const img = new Image();
                img.className = 'adv-full-logo';
                img.alt = originalText;
                img.src = url;
                this.setImageSizing(img, textHeightPx);

                this.syncFullHead(container, true);
                this.swapContent(titleEl, img);
            });
        }
    }

    const Logo = new LogoEngine();

    // Стили
    Lampa.Template.add('adv_logo_style', `<style>
        :root { --ni-logo-max-h: clamp(3.6em, 11vh, 7.2em); --ni-card-logo-h: clamp(2.2em, 6vh, 3.8em); }
        .card .card__view { position: relative; }
        .adv-card-logo {
            position: absolute; left: 0; right: 0; bottom: 0; padding: 0.35em 0.45em;
            box-sizing: border-box; pointer-events: none;
            background: linear-gradient(to top, rgba(0,0,0,0.78), transparent);
        }
        .adv-card-logo-img, .adv-full-logo {
            display: block; max-width: 100%; max-height: var(--ni-card-logo-h);
            object-fit: contain; object-position: left bottom;
        }
        .adv-full-logo { max-height: var(--ni-logo-max-h); margin-top: 0.25em; }
        .adv-moved-head { opacity: 0.92; font-size: 1.1em; }
    </style>`);
    $('body').append(Lampa.Template.get('adv_logo_style', {}, true));

    // Полная карточка
    function hookFull() {
        if (window.__adv_full_hooked) return;
        window.__adv_full_hooked = true;

        Lampa.Listener.follow('full', e => {
            if (e.type !== 'complite') return; // возвращено 'complite'
            const data = e.data && (e.data.movie || e.data);
            if (data) Logo.applyToFull(e.object.activity, data);
        });
    }

    // Карточки в списках (MutationObserver)
    function initCardObserver() {
        const applyToExisting = () => {
            document.querySelectorAll('.card').forEach(node => {
                if (node.card_data && node.card_data.id) {
                    Logo.applyToCard({
                        data: node.card_data,
                        render: () => $(node),
                        __adv_logo_req_id: 0
                    });
                }
            });
        };

        applyToExisting();

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('card')) {
                        if (node.card_data && node.card_data.id) {
                            Logo.applyToCard({
                                data: node.card_data,
                                render: () => $(node),
                                __adv_logo_req_id: 0
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function start() {
        if (window.adv_logos_ready) return;
        window.adv_logos_ready = true;

        initLogoSettings();
        hookFull();
        initCardObserver();
    }

    if (!window.adv_logos_ready) start();
})();
