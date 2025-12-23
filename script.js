

        let completedLessons = JSON.parse(localStorage.getItem('gitCompletedLessons') || '[]');


        function setupCopyButtons() {
            document.querySelectorAll('pre').forEach(pre => {
                if (pre.querySelector('.copy-btn')) return;
                const btn = document.createElement('button');
                btn.className = 'copy-btn';
                btn.innerHTML = '<i class="far fa-copy"></i> Copy';
                btn.onclick = async () => {
                    const codeNode = pre.querySelector('code');
                    const code = codeNode ? codeNode.innerText : pre.innerText;
                    await navigator.clipboard.writeText(code);
                    btn.innerHTML = '<i class="fas fa-check text-emerald-500"></i> Copied!';
                    setTimeout(() => btn.innerHTML = '<i class="far fa-copy"></i> Copy', 2000);
                };
                pre.appendChild(btn);
            });
        }

        function showSection(id) {
            const sections = document.querySelectorAll('.content-section');
            const nextSection = document.getElementById(id);
            if (!nextSection) return;

            sections.forEach(s => {
                s.classList.remove('active');
                s.style.display = 'none';
            });

            nextSection.style.display = 'block';
            setTimeout(() => nextSection.classList.add('active'), 10);

            // Update UI
            document.querySelectorAll('.lesson-item').forEach(item => item.classList.remove('active'));
            const navItem = document.getElementById(`nav-${id}`);
            if (navItem) navItem.classList.add('active');

            // Update Header
            const lessonTitle = navItem ? navItem.querySelector('.text-sm').innerText : 'Leçon';
            const currentTitleElem = document.getElementById('current-lesson-title');
            if (currentTitleElem) currentTitleElem.innerText = lessonTitle;

            updateTakeaways(id);
            generateTOC(nextSection);
            updateProgress();

            const container = document.querySelector('.content-panel');
            if (container) container.scrollTo({ top: 0, behavior: 'smooth' });

            window.location.hash = id;
        }

        function markCompleted() {
            const currentId = window.location.hash.replace('#', '') || 'intro';
            if (!completedLessons.includes(currentId)) {
                completedLessons.push(currentId);
                localStorage.setItem('gitCompletedLessons', JSON.stringify(completedLessons));
            }
            updateProgress();
        }

        function updateProgress() {
            const total = document.querySelectorAll('.lesson-item').length;
            const completed = completedLessons.length;
            const percent = Math.round((completed / total) * 100);

            const progressBar = document.getElementById('global-progress-bar');
            const progressTxt = document.getElementById('global-progress-txt');

            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressTxt) progressTxt.innerText = `${percent}%`;

            document.querySelectorAll('.lesson-item').forEach(item => {
                const id = item.id.replace('nav-', '');
                if (completedLessons.includes(id)) {
                    item.classList.add('completed');
                }
            });
        }

        function goToNext() {
            const items = Array.from(document.querySelectorAll('.lesson-item'));
            const currentIndex = items.findIndex(item => item.classList.contains('active'));
            if (currentIndex < items.length - 1) {
                const nextId = items[currentIndex + 1].id.replace('nav-', '');
                showSection(nextId);
            }
        }

        function generateTOC(section) {
            const tocList = document.getElementById('toc-list');
            if (!tocList) return;
            tocList.innerHTML = '';
            const headings = section.querySelectorAll('h2, h3, h4');
            headings.forEach((h, i) => {
                const id = 'heading-' + i;
                h.id = id;
                const link = document.createElement('div');
                link.className = 'text-[13px] font-medium text-slate-600 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2 py-1';
                link.innerHTML = `<i class="fas fa-hashtag text-[10px] opacity-30"></i> ${h.innerText}`;
                link.onclick = () => {
                    h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                };
                tocList.appendChild(link);
            });
        }

        function updateTakeaways(id) {
            const box = document.getElementById('lesson-takeaways');
            if (!box) return;
            const takeaways = {
                'intro': 'Git permet de sauvegarder chaque étape de votre code. C\'est votre "machine à remonter le temps" pour développeur.',
                'pre-requis': 'Installez Git et créez un compte GitHub. Sans ces deux là, pas de workflow pro possible.',
                'git-config': 'Identifiez-vous une fois pour toutes. Git a besoin de savoir qui signe les modifications.',
                'ssh-setup': 'La clé SSH est votre badge d\'accès automatique. Plus besoin de mots de passe répétitifs.',
                'github': 'Le "Repo" est la maison de votre code sur le web. Restez organisé dès le début.',
                'push': 'Add (préparer), Commit (valider), Push (envoyer). Le trio magique du développeur.',
                'vercel': 'Le bouton magique pour transformer votre code en une URL publique. Rapide et automatique.',
                'conflits': 'Ne paniquez pas. Un conflit est juste une question de choix entre deux versions de code.',
                'workflow-collab': 'Travaillez toujours sur des branches. La branche "main" est sacrée et doit rester stable.'
            };
            box.innerHTML = `<p class="text-sm leading-relaxed font-medium">${takeaways[id] || 'Continuez à apprendre pour maîtriser le workflow !'}</p>`;
        }

        document.addEventListener('DOMContentLoaded', () => {

            const hash = window.location.hash.replace('#', '') || 'intro';
            showSection(hash);
            setupCopyButtons();
            updateProgress();
        });
