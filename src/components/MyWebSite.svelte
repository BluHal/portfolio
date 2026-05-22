<script lang="ts">
	import { onMount } from 'svelte';

	interface Skill {
		name: string;
		pct: number;
	}
	interface SkillCat {
		id: string;
		label: string;
		jp: string;
		skills: Skill[];
	}

	const skillCategories: SkillCat[] = [
		{
			id: 'Frontend',
			label: 'Frontend',
			jp: 'フロント',
			skills: [
				{ name: 'JavaScript', pct: 80 },
				{ name: 'TypeScript', pct: 80 },
				{ name: 'Angular', pct: 80 },
				{ name: 'React', pct: 60 },
				{ name: 'SvelteKit', pct: 40 },
				{ name: 'jQuery', pct: 60 }
			]
		},
		{
			id: 'Backend',
			label: 'Backend',
			jp: 'バックエンド',
			skills: [
				{ name: 'Node.js', pct: 80 },
				{ name: 'Koa', pct: 60 },
				{ name: 'C#', pct: 60 },
				{ name: 'Java', pct: 60 },
				{ name: 'Go', pct: 40 },
				{ name: 'Python', pct: 40 }
			]
		},
		{
			id: 'Database',
			label: 'Database',
			jp: 'データベース',
			skills: [
				{ name: 'MongoDB', pct: 80 },
				{ name: 'SQL', pct: 60 }
			]
		},
		{
			id: 'DevOps',
			label: 'DevOps / Mobile',
			jp: 'ツール',
			skills: [
				{ name: 'Docker', pct: 60 },
				{ name: 'Flutter', pct: 40 }
			]
		}
	];

	const experience = [
		{
			company: 'Addiction srl',
			group: null as string | null,
			role: 'Software Developer',
			period: '2022 – Present',
			description:
				'Development of proprietary PIM and PXM software. B2B sector focused on product information management.',
			tech: ['Angular', 'Node.js', 'MongoDB', 'Docker']
		},
		{
			company: 'Lutech CDM spa',
			group: 'Lutech Group' as string | null,
			role: 'Software Developer',
			period: 'Aug 2017 – 2022',
			description:
				'CRM systems, commercial configurators, real-time notifications, warehouse management software, and custom client solutions. B2C sector.',
			tech: ['Angular', 'C#', 'Java', 'SQL', 'MongoDB', 'jQuery']
		}
	];

	const projects = [
		{
			name: 'City Pop Cafe',
			url: 'https://city-pop-cafe.vercel.app/',
			description:
				'A web app dedicated to City Pop music culture. Browse tracks, discover artists, and relive the summer vibes of Japanese pop from the 80s.',
			year: '2024',
			tags: ['SvelteKit', 'TypeScript']
		},
		{
			name: 'This Portfolio',
			url: '#',
			description:
				"Win95-style interactive desktop portfolio. Built with SvelteKit + Svelte 5, featuring draggable windows, themes, and this very retro '97 design.",
			year: '2025',
			tags: ['SvelteKit', 'Svelte 5', 'Tailwind']
		}
	];

	const pad2 = (n: number) => String(n).padStart(2, '0');
	const nowInit = new Date();
	const heroDate = `${pad2(nowInit.getMonth() + 1)}·${pad2(nowInit.getDate())}·${String(nowInit.getFullYear()).slice(-2)}`;
	const currentYear = nowInit.getFullYear();

	let casioDay = $state('---');
	let casioHH = $state('--');
	let casioMM = $state('--');
	let casioSS = $state('--');
	let casioDateStr = $state('--·--·--');
	let hitCount = $state('004782');
	let loadedSkillIds = $state<Set<string>>(new Set());

	function scrollToSection(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function handleGuestbook(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const nameInput = form.querySelector<HTMLInputElement>('[name="gb_name"]');
		const name = (nameInput?.value || 'anonymous').trim();
		alert(
			`★ Thanks ${name}! Your message has been signed in the guestbook.\n\n(Just kidding — this is a placeholder form. ;-)`
		);
		form.reset();
	}

	onMount(() => {
		const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
		const pad = (n: number) => (n < 10 ? '0' + n : '' + n);

		function tick() {
			const now = new Date();
			casioDay = DAYS[now.getDay()];
			casioHH = pad(now.getHours());
			casioMM = pad(now.getMinutes());
			casioSS = pad(now.getSeconds());
			casioDateStr = `${pad(now.getMonth() + 1)}·${pad(now.getDate())}·${String(now.getFullYear()).slice(-2)}`;
		}
		tick();
		const clockInterval = setInterval(tick, 1000);

		const COUNTER_BASE = 4782;
		const KEY = 'portfolio97_hits';
		let hits = parseInt(localStorage.getItem(KEY) || '0', 10) || 0;
		hits += 1;
		localStorage.setItem(KEY, String(hits));
		hitCount = String(COUNTER_BASE + hits).padStart(6, '0');

		const skillEls = document.querySelectorAll<HTMLElement>('[data-skill-id]');
		if ('IntersectionObserver' in window && skillEls.length) {
			const io = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const el = entry.target as HTMLElement;
							const id = el.dataset.skillId!;
							const delay = parseInt(el.dataset.skillDelay || '0');
							setTimeout(() => {
								loadedSkillIds = new Set([...loadedSkillIds, id]);
							}, delay);
							io.unobserve(el);
						}
					});
				},
				{ threshold: 0.3 }
			);
			skillEls.forEach((el) => io.observe(el));
		} else {
			loadedSkillIds = new Set(Array.from(skillEls).map((el) => el.dataset.skillId!));
		}

		return () => clearInterval(clockInterval);
	});
</script>

<div class="page">
	<!-- ===== SIDEBAR ===== -->
	<aside class="sidebar">
		<!-- svelte-ignore a11y_missing_attribute -->
		<a
			class="sb-logo"
			role="link"
			tabindex="0"
			onclick={() => scrollToSection('top')}
			onkeydown={(e) => e.key === 'Enter' && scrollToSection('top')}
		>
			<div class="name">NICOLÒ REDOLFI</div>
			<div class="role">★ Software Developer ★</div>
			<div class="jp">ソフトウェアエンジニア</div>
		</a>

		<nav>
			<ul class="sb-nav" aria-label="Main">
				<li>
					<a href="#top" onclick={(e) => { e.preventDefault(); scrollToSection('top'); }}>
						<span class="b">»</span><span class="en">Home</span><span class="jp">ホーム</span>
					</a>
				</li>
				<li>
					<a href="#about" onclick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
						<span class="b">»</span><span class="en">About</span><span class="jp">プロフィール</span>
					</a>
				</li>
				<li>
					<a href="#work" onclick={(e) => { e.preventDefault(); scrollToSection('work'); }}>
						<span class="b">»</span><span class="en">Work</span><span class="jp">経歴</span>
					</a>
				</li>
				<li>
					<a href="#skills" onclick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>
						<span class="b">»</span><span class="en">Skills</span><span class="jp">スキル</span>
					</a>
				</li>
				<li>
					<a href="#projects" onclick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>
						<span class="b">»</span><span class="en">Projects</span><span class="jp">プロジェクト</span>
					</a>
				</li>
				<li>
					<a href="#hobbies" onclick={(e) => { e.preventDefault(); scrollToSection('hobbies'); }}>
						<span class="b">»</span><span class="en">Hobbies</span><span class="jp">趣味</span>
					</a>
				</li>
				<li>
					<a href="#guestbook" onclick={(e) => { e.preventDefault(); scrollToSection('guestbook'); }}>
						<span class="b">»</span><span class="en">Guestbook</span><span class="jp">ゲスト</span>
					</a>
				</li>
			</ul>
		</nav>

		<div class="casio" aria-label="Local time">
			<div class="lcd">
				<div class="day">{casioDay}</div>
				<div class="time">{casioHH}<span class="sep">:</span>{casioMM}<span class="sep">:</span>{casioSS}</div>
				<div class="date">{casioDateStr}</div>
			</div>
		</div>

		<div class="now-playing" aria-label="Now playing">
			<div class="np-h">Now Playing <span class="jp">再生中</span></div>
			<div class="np-track">
				<div class="t">Plastic Love</div>
				<div class="a">— Mariya Takeuchi</div>
			</div>
			<div class="np-bar"></div>
			<div class="np-meta"><span>02:17</span><span>06:01</span></div>
		</div>

		<div class="sb-block">
			<div class="h">Updates <span class="jp">更新</span></div>
			<div class="u">
				<span class="d">05·22</span><span>portfolio v2 live</span>
				<span class="d">05·18</span><span>new projects added</span>
				<span class="d">04·10</span><span>skills updated</span>
				<span class="d">03·01</span><span>site v1 launched</span>
			</div>
		</div>

		<div class="web-ring">
			<div class="h">★ JP WEB RING ★</div>
			<div>
				<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" onclick={(e) => e.preventDefault()} title="Previous site">«PREV</a>
				·
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#" onclick={(e) => e.preventDefault()} title="Random">RAND</a>
				·
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#" onclick={(e) => e.preventDefault()} title="Next site">NEXT»</a>
			</div>
		</div>
	</aside>

	<!-- ===== MAIN ===== -->
	<main class="main" id="top">
		<!-- Topbar -->
		<div class="topbar">
			<span class="pill"><span class="star">〒</span> STATUS: <strong style="color:var(--teal);">ONLINE</strong></span>
			<span class="pill"><span class="red">★</span> BEST IN 800×600</span>
			<span class="pill">IE 4.0+ / NETSCAPE 4</span>
			<span class="pill">CHARSET: SHIFT-JIS</span>
			<span class="grow"></span>
			<span class="pill lcd" aria-label="Visitor counter">
				VISITORS · <span class="digits">{hitCount}</span>
				<span class="blinker">▮</span>
			</span>
		</div>

		<!-- Marquee -->
		<div class="marquee" aria-hidden="true">
			<span class="track">
				<span class="en">★ WELCOME TO MY HOMEPAGE ★</span>
				<span class="sep">◆</span> ようこそ私のホームページへ
				<span class="sep">◆</span>
				<span class="en">UPDATE {heroDate} — PORTFOLIO V2 LIVE</span>
				<span class="sep">◆</span>
				<span class="en">NICOLÒ REDOLFI · SOFTWARE DEVELOPER · ITALY</span>
				<span class="sep">◆</span>
				<span class="en">THX FOR VISITING — SIGN MY GUESTBOOK!</span>
				<span class="sep">◆</span> 〒 〠 ★ ◆ ● △ ■
				<span class="sep">◆</span>
				<span class="en">MADE WITH NOTEPAD &amp; LOVE</span>
				<span class="sep">◆</span>
			</span>
		</div>

		<!-- Hero -->
		<section class="hero" aria-labelledby="hero-name">
			<div>
				<h1 id="hero-name">
					NICOLÒ REDOLFI
					<span class="jp-name">レドルフィ・ニコロ ・ ソフトウェアデベロッパー</span>
				</h1>
				<div class="role-line">
					<span class="arrow">&gt;</span>
					<strong>Software Developer</strong> · <span style="color:var(--purple);">Italy / Internet</span> · est.
					2017
				</div>
				<div class="tagline">
					Full-stack engineer shipping production code since 2017 — from CRM systems to PIM platforms,
					with a soft spot for clean architecture.
				</div>
				<div class="hero-meta">
					<span class="b800">★ BEST IN 800×600</span>
					<span class="ie">IE 4.0+</span>
					<span class="upd">UPDATED {heroDate}</span>
					<span style="color:var(--ink-soft);font-family:var(--font-mono);"
						>— hit counter &gt; <strong style="color:var(--red);">{hitCount}</strong></span
					>
				</div>
			</div>
			<div class="avatar-wrap">
				<img src="/avatar.png" alt="Nicolò Redolfi" class="avatar bevel-out" />
				<div class="avatar-cap">nicolò · dev</div>
			</div>
		</section>

		<div class="gif-divider" aria-hidden="true"></div>

		<!-- About -->
		<section id="about" aria-labelledby="about-h">
			<div class="sec-h">
				<span class="ico">💾</span>
				<span class="en" id="about-h">About Me</span>
				<span class="jp">プロフィール</span>
				<span class="grow"></span>
				<span class="meta">[#about]</span>
			</div>
			<div class="sec-body">
				<div class="about-grid">
					<div>
						<img src="/avatar.png" alt="Nicolò Redolfi" class="about-avatar bevel-in" />
						<div class="about-cap">photo · pixel</div>
					</div>
					<div class="about-text">
						<p class="lead">Full-stack developer based in Italy, building for the web since 2017.</p>
						<p>
							I'm Nicolò Redolfi — 8+ years shipping production software across CRM systems,
							commercial configurators, real-time notifications, warehouse management, and currently
							<strong>PIM &amp; PXM platforms</strong>. My sweet spot: clean architecture that users
							actually enjoy.
						</p>
						<p>
							When not shipping features, I build personal projects to explore new tech and keep the
							edge sharp. This portfolio is one of them.
						</p>
						<dl class="kvs">
							<dt>Location</dt>
							<dd>Italy</dd>
							<dt>Currently</dt>
							<dd>Software Developer at Addiction srl</dd>
							<dt>Stack</dt>
							<dd>TypeScript · Angular · Node.js · MongoDB</dd>
							<dt>Email</dt>
							<dd><a href="mailto:nredolfi@icloud.com">nredolfi@icloud.com</a></dd>
						</dl>
					</div>
				</div>
			</div>
		</section>

		<div class="ascii-rule">★・゜・。.::・'°☆ ◆ ★・゜・。.::・'°☆ ◆ ★・゜・。.::・'°☆ ◆ ★・゜・。.::・'°☆</div>

		<!-- Work -->
		<section id="work" aria-labelledby="work-h">
			<div class="sec-h">
				<span class="ico">📁</span>
				<span class="en" id="work-h">Work Experience</span>
				<span class="jp">経歴</span>
				<span class="grow"></span>
				<span class="meta">{experience.length} entries</span>
			</div>
			<div class="sec-body">
				<table class="work-table">
					<thead>
						<tr>
							<th style="width:120px;">Period</th>
							<th style="width:160px;">Company</th>
							<th style="width:150px;">Role</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{#each experience as job}
							<tr>
								<td class="yr">{job.period}</td>
								<td class="co">
									{job.company}
									{#if job.group}<br /><span class="group">{job.group}</span>{/if}
								</td>
								<td class="ro">{job.role}</td>
								<td>
									{job.description}
									<div class="tech-row">
										{#each job.tech as t}<span class="tag">{t}</span>{/each}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<div class="ascii-rule teal">────────── 〒 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ◆ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 〒 ──────────</div>

		<!-- Skills -->
		<section id="skills" aria-labelledby="skills-h">
			<div class="sec-h">
				<span class="ico">🖥️</span>
				<span class="en" id="skills-h">Skills</span>
				<span class="jp">スキル</span>
				<span class="grow"></span>
				<span class="meta">loading<span class="blink">...</span></span>
			</div>
			<div class="sec-body">
				<div class="skills-grid">
					{#each skillCategories as cat}
						<div class="skill-cat">
							<h3 class="skill-cat-h">
								<span>{cat.label}</span><span class="jp">{cat.jp}</span>
							</h3>
							{#each cat.skills as skill, skillIdx}
								{@const skillId = `${cat.id}-${skill.name}`}
								<div
									class="skill"
									class:has-loaded={loadedSkillIds.has(skillId)}
									style="--p: {skill.pct}%"
									data-skill-id={skillId}
									data-skill-delay={skillIdx * 120}
								>
									<span class="nm">{skill.name}</span>
									<span class="bar"><span class="fill"></span></span>
									<span class="pc">{skill.pct}%</span>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</section>

		<div class="ascii-rule red">━━━━━━━━━━━━━━━━━━━━ ★ ━━━━━━━━━━━━━━━━━━━━ ◆ ━━━━━━━━━━━━━━━━━━━━ ★ ━━━━━━━━━━━━━━━━━━━━</div>

		<!-- Projects -->
		<section id="projects" aria-labelledby="projects-h">
			<div class="sec-h">
				<span class="ico">📦</span>
				<span class="en" id="projects-h">Projects</span>
				<span class="jp">プロジェクト</span>
				<span class="grow"></span>
				<span class="meta">grid · 2 col</span>
			</div>
			<div class="sec-body" style="background: var(--bg-soft);">
				<div class="projects">
					{#each projects as project}
						<article class="proj bevel-out">
							<div class="head">
								<span class="n">{project.name}</span>
								<span class="yr">© {project.year}</span>
							</div>
							<div class="thumb">{project.name}</div>
							<div class="desc">{project.description}</div>
							<div class="proj-meta">
								<span class="tags">
									{#each project.tags as t}<span class="tag">{t}</span>{/each}
								</span>
								<a
									class="visit"
									href={project.url}
									target={project.url !== '#' ? '_blank' : undefined}
									rel="noopener noreferrer">Visit »</a
								>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<div class="ascii-rule">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 〠 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 〠 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

		<!-- Hobbies -->
		<section id="hobbies" aria-labelledby="hobbies-h">
			<div class="sec-h">
				<span class="ico p97-pulse">★</span>
				<span class="en" id="hobbies-h">Hobbies &amp; Interests</span>
				<span class="jp">趣味</span>
				<span class="grow"></span>
				<span class="meta">things i like</span>
			</div>
			<div class="sec-body">
				<div class="hobbies">
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="4" y="1" width="1" height="5" fill="#000080" />
							<rect x="5" y="1" width="2" height="1" fill="#000080" />
							<rect x="5" y="2" width="1" height="1" fill="#000080" />
							<rect x="2" y="5" width="3" height="2" fill="#800080" />
							<rect x="2" y="5" width="1" height="1" fill="#ff0000" />
						</svg>
						<span class="lbl"><strong>{'{Music}'}</strong><small>音楽</small></span>
					</div>
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="1" y="1" width="6" height="6" fill="#008080" />
							<rect x="2" y="2" width="4" height="1" fill="#ffffff" />
							<rect x="2" y="4" width="4" height="1" fill="#ffffff" />
							<rect x="2" y="6" width="3" height="1" fill="#ffffff" />
						</svg>
						<span class="lbl"><strong>{'{Reading}'}</strong><small>読書</small></span>
					</div>
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="1" y="2" width="6" height="4" fill="#404040" />
							<rect x="2" y="3" width="1" height="1" fill="#ff0000" />
							<rect x="3" y="3" width="1" height="1" fill="#ffd700" />
							<rect x="5" y="3" width="1" height="1" fill="#008080" />
							<rect x="5" y="4" width="1" height="1" fill="#000080" />
							<rect x="2" y="4" width="2" height="1" fill="#ffffff" />
						</svg>
						<span class="lbl"><strong>{'{Retro Gaming}'}</strong><small>ゲーム</small></span>
					</div>
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="1" y="2" width="6" height="5" fill="#1a1a1a" />
							<rect x="3" y="1" width="2" height="1" fill="#1a1a1a" />
							<rect x="2" y="3" width="4" height="3" fill="#008080" />
							<rect x="5" y="3" width="1" height="1" fill="#ff0000" />
						</svg>
						<span class="lbl"><strong>{'{Photography}'}</strong><small>写真</small></span>
					</div>
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="2" y="3" width="3" height="3" fill="#ffffff" />
							<rect x="2" y="3" width="3" height="1" fill="#8b4513" />
							<rect x="5" y="4" width="1" height="2" fill="#ffffff" />
							<rect x="3" y="1" width="1" height="2" fill="#a0a0a0" />
							<rect x="4" y="0" width="1" height="2" fill="#a0a0a0" />
						</svg>
						<span class="lbl"><strong>{'{Coffee}'}</strong><small>コーヒー</small></span>
					</div>
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="1" y="2" width="2" height="1" fill="#ffd700" />
							<rect x="1" y="3" width="3" height="1" fill="#ffd700" />
							<rect x="2" y="4" width="3" height="2" fill="#ff8c00" />
							<rect x="2" y="2" width="1" height="1" fill="#000000" />
							<rect x="5" y="5" width="1" height="1" fill="#000000" />
						</svg>
						<span class="lbl"><strong>{'{Pixel Cats}'}</strong><small>猫</small></span>
					</div>
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="0" y="3" width="8" height="3" fill="#008080" />
							<rect x="0" y="3" width="8" height="1" fill="#00a0a0" />
							<rect x="3" y="5" width="2" height="2" fill="#800080" />
						</svg>
						<span class="lbl"><strong>{'{Sea Trips}'}</strong><small>旅行</small></span>
					</div>
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="1" y="1" width="6" height="6" fill="#c0c0c0" />
							<rect x="2" y="2" width="4" height="4" fill="#000080" />
							<rect x="3" y="3" width="2" height="1" fill="#ffd700" />
							<rect x="3" y="5" width="2" height="1" fill="#ffd700" />
						</svg>
						<span class="lbl"><strong>{'{Old Hardware}'}</strong><small>機械</small></span>
					</div>
					<div class="hobby">
						<svg class="pix" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
							<rect x="2" y="1" width="1" height="6" fill="#800080" />
							<rect x="5" y="1" width="1" height="6" fill="#800080" />
							<rect x="1" y="2" width="6" height="1" fill="#800080" />
							<rect x="1" y="5" width="6" height="1" fill="#800080" />
							<rect x="3" y="3" width="2" height="2" fill="#ff0000" />
						</svg>
						<span class="lbl"><strong>{'{ASCII Art}'}</strong><small>AA</small></span>
					</div>
				</div>
			</div>
		</section>

		<div class="gif-divider" aria-hidden="true" style="margin-top:4px;"></div>

		<!-- Guestbook / Contact -->
		<section id="guestbook" aria-labelledby="gb-h">
			<div class="sec-h">
				<span class="ico">✉</span>
				<span class="en" id="gb-h">Guestbook</span>
				<span class="jp">ゲストブック</span>
				<span class="grow"></span>
				<span class="meta">sign before you leave!</span>
			</div>
			<div class="sec-body">
				<div class="footer-grid">
					<form id="gb-form" class="gb-form bevel-out" autocomplete="off" novalidate onsubmit={handleGuestbook}>
						<div class="h">
							Sign My Guestbook <span class="jp">★ 記帳する</span>
						</div>
						<div class="row">
							<label for="gb-name">Name</label>
							<input id="gb-name" name="gb_name" type="text" placeholder="your handle" />
						</div>
						<div class="row">
							<label for="gb-email">E-Mail</label>
							<input id="gb-email" name="gb_email" type="email" placeholder="you@domain.com" />
						</div>
						<div class="row">
							<label for="gb-url">URL</label>
							<input id="gb-url" name="gb_site" type="text" placeholder="http://www.your-site.com/" />
						</div>
						<div class="row" style="align-items:flex-start;">
							<label for="gb-msg" style="margin-top:4px;">Message</label>
							<textarea id="gb-msg" name="gb_msg" placeholder="leave a kind word — kanji welcome!"></textarea>
						</div>
						<div class="actions">
							<span class="small">no html · max 256 chars · all signs reviewed</span>
							<button type="submit" class="btn">[ ★ Sign! ]</button>
						</div>
					</form>

					<div class="gb-side">
						<div class="panel bevel-thin">
							<div class="h">
								Contact <span style="color:var(--purple);float:right;font-family:var(--font-jp);font-size:9px;">連絡先</span>
							</div>
							<div class="mail-line">
								✉ <a href="mailto:nredolfi@icloud.com">nredolfi<span class="at">@</span>icloud.com</a>
							</div>
							<div style="margin-top:4px;">
								★ <a href="https://github.com/BluHal/" target="_blank" rel="noopener noreferrer">github.com/BluHal</a>
							</div>
							<div style="margin-top:4px;">
								☎ <a href="https://it.linkedin.com/in/nicol%C3%B2-redolfi-36143a188/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
							</div>
						</div>

						<div class="panel bevel-thin">
							<div class="h">
								Site Badges <span style="color:var(--purple);float:right;font-family:var(--font-jp);font-size:9px;">バッジ</span>
							</div>
							<div class="badges">
								<div class="b88 navy"><span class="ico">★</span> BEST 800×600</div>
								<div class="b88 teal">IE 4.0+ OPTIMIZED</div>
								<div class="b88 html">
									<div class="l">H4</div>
									<div class="r">HAND CODED · HTML 4.01</div>
								</div>
								<div class="b88 purple"><span class="star">★</span>JP WEB RING<span class="star">★</span></div>
								<div class="b88 gold">★ 1997 ANYBROWSER ★</div>
								<div class="b88 notepad">MADE IN<br />NOTEPAD.EXE</div>
							</div>
						</div>
					</div>
				</div>

				<div class="colophon">
					© 1997–{currentYear} Nicolò Redolfi · All rights reserved · No frames, no problem · Made
					with <span class="heart">♥</span> and Notepad ·
					<span class="jp-col">愛とメモ帳で作られた</span> ·
					<a href="mailto:nredolfi@icloud.com">nredolfi@icloud.com</a>
				</div>
			</div>
		</section>

		<div class="ascii-rule" style="margin-top:4px;">━━━━━━━━━━━━━━━━━━━━ 〒 END OF DOCUMENT · ページの終わり · 〒 ━━━━━━━━━━━━━━━━━━━━</div>
	</main>
</div>

<style>
	/* ── CSS Variables ── */
	.page {
		--bg: #c0c0c0;
		--bg-soft: #d4d0c8;
		--bg-paper: #efe9d4;
		--bg-paper2: #f7f2e0;
		--ink: #000000;
		--ink-soft: #2a2a2a;
		--ink-faint: #5a5a5a;
		--teal: #008080;
		--purple: #800080;
		--navy: #000080;
		--blue: #0000ff;
		--visited: #800080;
		--gold: #ffd700;
		--red: #ff0000;
		--white: #ffffff;
		--hilite: #ffff66;
		--bevel-hi: #ffffff;
		--bevel-lo: #808080;
		--bevel-dk: #404040;
		--font-jp: 'MS PGothic', 'MS Gothic', 'Hiragino Kaku Gothic Pro', 'Osaka', monospace;
		--font-mono: 'MS Gothic', 'Osaka-Mono', ui-monospace, 'Courier New', monospace;
		--font-arial: 'Arial Narrow', Arial, sans-serif;

		width: 100%;
		min-width: 1024px;
		min-height: 100%;
		background: var(--bg);
		display: grid;
		grid-template-columns: 200px 1fr;
		font-family: var(--font-jp);
		font-size: 12px;
		line-height: 1.4;
		color: var(--ink);
		cursor: crosshair;
	}

	/* ── Global resets within component ── */
	* {
		box-sizing: border-box;
	}

	a {
		color: var(--blue);
		text-decoration: underline;
		cursor: crosshair;
	}
	a:visited {
		color: var(--visited);
	}
	a:hover {
		background: var(--hilite);
		color: var(--ink);
	}
	a:active {
		color: var(--red);
	}

	p {
		margin: 0 0 8px;
	}

	/* ── Bevel helpers ── */
	.bevel-out {
		border: 2px solid;
		border-top-color: var(--bevel-hi);
		border-left-color: var(--bevel-hi);
		border-right-color: var(--bevel-lo);
		border-bottom-color: var(--bevel-lo);
		box-shadow:
			inset -1px -1px 0 var(--bevel-dk),
			inset 1px 1px 0 var(--bg-soft);
	}
	.bevel-in {
		border: 2px solid;
		border-top-color: var(--bevel-lo);
		border-left-color: var(--bevel-lo);
		border-right-color: var(--bevel-hi);
		border-bottom-color: var(--bevel-hi);
		box-shadow:
			inset 1px 1px 0 var(--bevel-dk),
			inset -1px -1px 0 var(--bg-soft);
	}
	.bevel-thin {
		border: 1px solid;
		border-top-color: var(--bevel-hi);
		border-left-color: var(--bevel-hi);
		border-right-color: var(--bevel-lo);
		border-bottom-color: var(--bevel-lo);
	}

	/* ── Sidebar ── */
	.sidebar {
		background: var(--bg);
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		position: sticky;
		top: 0;
		align-self: start;
		min-width: 0;
	}

	.sb-logo {
		padding: 8px 6px;
		text-align: center;
		background: var(--navy);
		color: var(--white);
		text-decoration: none;
		display: block;
		cursor: crosshair;
	}
	.sb-logo:hover {
		background: var(--navy);
	}
	.sb-logo .name {
		font-family: var(--font-arial);
		font-weight: 700;
		font-size: 16px;
		letter-spacing: 0.04em;
		line-height: 1;
	}
	.sb-logo .role {
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		margin-top: 4px;
		color: var(--gold);
	}
	.sb-logo .jp {
		font-family: var(--font-jp);
		font-size: 10px;
		color: #c8c8e8;
		margin-top: 2px;
	}

	.sb-nav {
		list-style: none;
		margin: 0;
		padding: 0;
		background: var(--white);
		font-size: 11px;
	}
	.sb-nav a {
		display: flex;
		align-items: baseline;
		gap: 4px;
		padding: 4px 6px;
		border-bottom: 1px dashed var(--bevel-lo);
		text-decoration: none;
		color: var(--navy);
		font-family: var(--font-mono);
	}
	.sb-nav li:last-child a {
		border-bottom: none;
	}
	.sb-nav a:hover {
		background: var(--hilite);
		color: var(--ink);
	}
	.sb-nav .b {
		color: var(--red);
		font-weight: 700;
		width: 10px;
	}
	.sb-nav .en {
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.sb-nav .jp {
		margin-left: auto;
		color: var(--purple);
		font-family: var(--font-jp);
		font-size: 10px;
	}

	/* Casio */
	.casio {
		background: #b3bbab;
		padding: 6px 8px 8px;
		position: relative;
		font-family: var(--font-mono);
	}
	.casio::before {
		content: 'CASIO';
		position: absolute;
		top: 3px;
		left: 8px;
		font-family: var(--font-arial);
		font-weight: 700;
		font-size: 8px;
		letter-spacing: 0.2em;
		color: #2b2b2b;
	}
	.casio::after {
		content: 'F-91W';
		position: absolute;
		top: 3px;
		right: 8px;
		font-family: var(--font-arial);
		font-size: 7px;
		letter-spacing: 0.15em;
		color: #2b2b2b;
	}
	.casio .lcd {
		margin-top: 10px;
		background: #c9cdb8;
		padding: 4px 6px 5px;
		text-align: right;
		border: 1px solid #6e7466;
		box-shadow: inset 1px 1px 0 #8a907f;
	}
	.casio .day {
		font-size: 8px;
		letter-spacing: 0.2em;
		color: #2a3528;
		font-weight: 700;
	}
	.casio .time {
		font-family: 'Lucida Console', 'MS Gothic', monospace;
		font-weight: 700;
		font-size: 20px;
		color: #0d1a0c;
		letter-spacing: 0.05em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.casio .time .sep {
		animation: p97Blink 1s steps(2) infinite;
	}
	.casio .date {
		font-size: 9px;
		letter-spacing: 0.1em;
		color: #2a3528;
		margin-top: 2px;
		font-weight: 700;
	}

	/* Now Playing */
	.now-playing {
		background: var(--bg-soft);
		padding: 6px 8px 8px;
	}
	.np-h {
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		border-bottom: 1px solid var(--ink);
		padding-bottom: 2px;
		margin-bottom: 5px;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.np-h .jp {
		color: var(--purple);
		text-transform: none;
		letter-spacing: 0;
		font-size: 10px;
	}
	.np-track .t {
		font-weight: 700;
		font-size: 11px;
		color: var(--navy);
	}
	.np-track .a {
		font-size: 10px;
		color: var(--ink-soft);
	}
	.np-bar {
		height: 8px;
		background: var(--white);
		margin-top: 6px;
		position: relative;
		overflow: hidden;
	}
	.np-bar::before {
		content: '';
		position: absolute;
		inset: 0;
		width: 42%;
		background: repeating-linear-gradient(90deg, var(--teal) 0 3px, #00a0a0 3px 5px);
		animation: p97NpPulse 1.2s ease-in-out infinite;
	}
	.np-meta {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--ink-soft);
		margin-top: 2px;
	}

	/* Sidebar blocks */
	.sb-block {
		background: var(--white);
		padding: 6px 8px;
		font-size: 10px;
		line-height: 1.4;
		font-family: var(--font-mono);
	}
	.sb-block .h {
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 9px;
		color: var(--purple);
		border-bottom: 1px dashed var(--ink);
		padding-bottom: 2px;
		margin-bottom: 4px;
		display: flex;
		justify-content: space-between;
	}
	.sb-block .h .jp {
		color: var(--ink-soft);
		font-family: var(--font-jp);
		text-transform: none;
		letter-spacing: 0;
	}
	.sb-block .u {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0 6px;
		font-size: 9px;
	}
	.sb-block .u .d {
		color: var(--teal);
		font-weight: 700;
	}

	.web-ring {
		background: repeating-linear-gradient(45deg, var(--bg-soft) 0 4px, var(--bg) 4px 8px);
		text-align: center;
		font-family: var(--font-mono);
		font-size: 9px;
		padding: 8px 4px;
	}
	.web-ring .h {
		font-weight: 700;
		letter-spacing: 0.15em;
		color: var(--purple);
		margin-bottom: 4px;
	}
	.web-ring a {
		font-size: 9px;
	}

	/* ── Main ── */
	.main {
		padding: 8px 12px 24px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: var(--bg);
		min-width: 0;
		overflow: hidden;
	}

	/* Topbar */
	.topbar {
		display: flex;
		align-items: stretch;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 10px;
		flex-wrap: wrap;
		width: 100%;
		min-width: 0;
	}
	.pill {
		padding: 2px 8px;
		background: var(--bg-soft);
		font-size: 10px;
		letter-spacing: 0.04em;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		white-space: nowrap;
	}
	.pill.lcd {
		background: #0a1208;
		color: #6fff5e;
		font-family: 'Lucida Console', 'MS Gothic', monospace;
		letter-spacing: 0.18em;
		font-weight: 700;
	}
	.pill .star {
		color: var(--gold);
	}
	.pill .red {
		color: var(--red);
	}
	.pill .digits {
		display: inline-flex;
		gap: 2px;
	}
	.pill .blinker {
		animation: p97Blink 0.9s steps(2) infinite;
	}
	.grow {
		flex: 1;
	}

	/* Marquee */
	.marquee {
		background: var(--ink);
		color: var(--gold);
		font-family: var(--font-jp);
		font-size: 12px;
		padding: 4px 0;
		overflow: hidden;
		position: relative;
		white-space: nowrap;
		border-top: 1px solid var(--bevel-lo);
		border-bottom: 1px solid var(--bevel-lo);
		width: 100%;
		min-width: 0;
		max-width: 100%;
	}
	.marquee .track {
		display: inline-block;
		padding-left: 100%;
		animation: p97Marquee 36s linear infinite;
	}
	.marquee .track .sep {
		color: var(--red);
		margin: 0 14px;
	}
	.marquee .track .en {
		color: var(--white);
	}

	/* Hero */
	.hero {
		background: var(--bg);
		display: grid;
		grid-template-columns: 1fr 180px;
		gap: 14px;
		align-items: center;
		padding: 14px 14px 12px;
	}
	.hero h1 {
		margin: 0;
		font-family: var(--font-arial);
		font-weight: 700;
		font-size: 40px;
		letter-spacing: 0.01em;
		line-height: 1;
		color: var(--navy);
		text-shadow: 2px 2px 0 var(--bg-soft);
	}
	.hero h1 .jp-name {
		display: block;
		font-family: var(--font-jp);
		font-size: 12px;
		color: var(--purple);
		margin-top: 6px;
		letter-spacing: 0.1em;
		font-weight: 400;
		text-shadow: none;
	}
	.hero .role-line {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--ink);
		margin-top: 8px;
	}
	.hero .role-line .arrow {
		color: var(--red);
		margin-right: 4px;
	}
	.hero .role-line strong {
		color: var(--teal);
	}
	.hero .tagline {
		font-family: var(--font-jp);
		font-size: 12px;
		color: var(--ink-soft);
		margin-top: 4px;
		max-width: 56ch;
	}
	.hero .avatar-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.hero .avatar {
		width: 140px;
		height: 140px;
		object-fit: cover;
		object-position: top center;
		display: block;
		image-rendering: pixelated;
	}
	.hero .avatar-cap {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--ink-soft);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	.hero-meta {
		display: flex;
		gap: 6px;
		margin-top: 10px;
		font-family: var(--font-mono);
		font-size: 10px;
		align-items: center;
		flex-wrap: wrap;
	}
	.hero-meta .b800 {
		padding: 2px 6px;
		background: var(--gold);
		color: var(--ink);
		font-weight: 700;
	}
	.hero-meta .ie {
		padding: 2px 6px;
		background: var(--teal);
		color: var(--white);
		font-weight: 700;
	}
	.hero-meta .upd {
		padding: 2px 6px;
		background: var(--red);
		color: var(--white);
		font-weight: 700;
	}

	/* GIF divider */
	.gif-divider {
		height: 14px;
		background: repeating-linear-gradient(
			90deg,
			var(--red) 0 6px,
			var(--gold) 6px 12px,
			var(--teal) 12px 18px,
			var(--purple) 18px 24px,
			var(--navy) 24px 30px
		);
		background-size: 30px 100%;
		animation: p97StripeSlide 1.6s linear infinite;
		position: relative;
	}
	.gif-divider::before,
	.gif-divider::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--ink);
	}
	.gif-divider::before {
		top: 0;
	}
	.gif-divider::after {
		bottom: 0;
	}

	/* Section heading */
	.sec-h {
		display: flex;
		align-items: baseline;
		gap: 8px;
		background: var(--navy);
		color: var(--white);
		padding: 3px 8px;
		border-top: 1px solid var(--bevel-hi);
		border-left: 1px solid var(--bevel-hi);
		border-right: 1px solid var(--bevel-dk);
		border-bottom: 1px solid var(--bevel-dk);
		font-family: var(--font-arial);
	}
	.sec-h .ico {
		font-size: 13px;
	}
	.sec-h .en {
		font-weight: 700;
		font-size: 13px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.sec-h .jp {
		font-family: var(--font-jp);
		font-size: 11px;
		color: var(--gold);
		font-weight: 400;
	}
	.sec-h .grow {
		flex: 1;
	}
	.sec-h .meta {
		font-family: var(--font-mono);
		font-size: 10px;
		color: #c8c8e8;
	}
	.sec-h .meta .blink {
		animation: p97Blink 1.2s steps(2) infinite;
		color: var(--gold);
	}

	/* Section body */
	.sec-body {
		background: var(--white);
		padding: 12px;
		font-family: var(--font-jp);
		font-size: 12px;
		line-height: 1.55;
		color: var(--ink);
	}
	.sec-body p {
		margin: 0 0 8px;
	}
	.sec-body p:last-child {
		margin-bottom: 0;
	}

	/* About */
	.about-grid {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 16px;
		align-items: start;
	}
	.about-avatar {
		width: 140px;
		height: 140px;
		object-fit: cover;
		object-position: top center;
		display: block;
		image-rendering: pixelated;
	}
	.about-cap {
		font-family: var(--font-mono);
		font-size: 9px;
		text-align: center;
		color: var(--ink-soft);
		margin-top: 4px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}
	.about-text .lead {
		font-size: 13px;
		font-weight: 700;
		color: var(--navy);
		margin-bottom: 6px;
	}
	.about-text .kvs {
		margin-top: 10px;
		display: grid;
		grid-template-columns: 110px 1fr;
		font-family: var(--font-mono);
		font-size: 11px;
		border-top: 1px dashed var(--ink);
		padding-top: 6px;
		row-gap: 2px;
	}
	.about-text .kvs dt {
		color: var(--purple);
		text-transform: uppercase;
		font-size: 10px;
		letter-spacing: 0.08em;
	}
	.about-text .kvs dd {
		margin: 0;
		color: var(--ink);
	}

	/* ASCII divider */
	.ascii-rule {
		font-family: var(--font-mono);
		font-size: 11px;
		text-align: center;
		color: var(--purple);
		letter-spacing: 0.05em;
		overflow: hidden;
		white-space: nowrap;
		padding: 2px 0;
	}
	.ascii-rule.teal {
		color: var(--teal);
	}
	.ascii-rule.red {
		color: var(--red);
	}

	/* Work table */
	.work-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-mono);
		font-size: 11px;
		background: var(--white);
	}
	.work-table th,
	.work-table td {
		border: 1px solid var(--ink);
		padding: 6px 8px;
		text-align: left;
		vertical-align: top;
	}
	.work-table thead th {
		background: var(--teal);
		color: var(--white);
		text-transform: uppercase;
		font-size: 10px;
		letter-spacing: 0.08em;
	}
	.work-table tbody tr:nth-child(odd) td {
		background: var(--bg-paper);
	}
	.work-table tbody tr:nth-child(even) td {
		background: var(--bg-paper2);
	}
	.work-table tbody tr:hover td {
		background: var(--hilite);
	}
	.work-table .yr {
		white-space: nowrap;
		color: var(--navy);
		font-weight: 700;
	}
	.work-table .co {
		font-weight: 700;
	}
	.work-table .co .group {
		font-weight: 400;
		font-size: 10px;
		color: var(--ink-soft);
	}
	.work-table .ro {
		color: var(--purple);
	}
	.tech-row {
		display: flex;
		flex-wrap: wrap;
		gap: 3px;
		margin-top: 4px;
	}
	.work-table .tech-row .tag {
		font-size: 9px;
		padding: 1px 4px;
		background: var(--bg-soft);
		color: var(--ink);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	/* Skills */
	.skills-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px 20px;
	}
	.skill-cat-h {
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--white);
		background: var(--purple);
		padding: 2px 6px;
		margin: 0 0 6px;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.skill-cat-h .jp {
		font-family: var(--font-jp);
		color: var(--gold);
		font-size: 10px;
		font-weight: 400;
	}
	.skill {
		display: grid;
		grid-template-columns: 100px 1fr 40px;
		gap: 8px;
		align-items: center;
		font-size: 11px;
		margin-bottom: 3px;
		font-family: var(--font-mono);
	}
	.skill .nm {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.skill .bar {
		height: 12px;
		background: var(--white);
		position: relative;
		overflow: hidden;
		border: 1px solid;
		border-top-color: var(--bevel-lo);
		border-left-color: var(--bevel-lo);
		border-right-color: var(--bevel-hi);
		border-bottom-color: var(--bevel-hi);
	}
	.skill .bar .fill {
		position: absolute;
		inset: 1px;
		width: 0;
		background: repeating-linear-gradient(90deg, var(--teal) 0 6px, #00a8a8 6px 8px, var(--teal) 8px 10px);
		transition: width 1.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.skill.has-loaded .bar .fill {
		width: var(--p);
	}
	.skill .pc {
		font-family: 'Lucida Console', 'MS Gothic', monospace;
		font-size: 10px;
		text-align: right;
		color: var(--navy);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	/* Projects */
	.projects {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.proj {
		background: var(--bg);
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.proj .head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-bottom: 1px dashed var(--ink);
		padding-bottom: 3px;
	}
	.proj .head .n {
		font-family: var(--font-arial);
		font-weight: 700;
		font-size: 13px;
		color: var(--navy);
	}
	.proj .head .yr {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--purple);
	}
	.proj .thumb {
		width: 100%;
		aspect-ratio: 4/3;
		background: repeating-linear-gradient(135deg, #98a0b8 0 8px, #8898b0 8px 16px);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 5px;
		font-family: var(--font-mono);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #28304a;
		position: relative;
	}
	.proj .thumb::before {
		content: '';
		position: absolute;
		top: 6px;
		left: 6px;
		width: 18px;
		height: 14px;
		background: var(--red);
		border: 1px solid var(--ink);
	}
	.proj .thumb::after {
		content: '■';
		position: absolute;
		top: 6px;
		right: 6px;
		color: var(--white);
		font-size: 14px;
		line-height: 0.8;
	}
	.proj .desc {
		font-family: var(--font-jp);
		font-size: 11px;
		line-height: 1.45;
		color: var(--ink);
		min-height: 32px;
	}
	.proj-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--ink-soft);
		border-top: 1px dashed var(--ink);
		padding-top: 4px;
	}
	.proj-meta .visit {
		color: var(--blue);
		font-weight: 700;
		text-decoration: none;
		letter-spacing: 0.05em;
	}
	.proj-meta .visit:hover {
		background: var(--hilite);
	}
	.proj-meta .tags {
		display: flex;
		gap: 4px;
	}
	.proj-meta .tag {
		font-size: 9px;
		padding: 1px 4px;
		background: var(--bg-soft);
		color: var(--ink);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	/* Hobbies */
	.hobbies {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px 12px;
	}
	.hobby {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-jp);
		font-size: 12px;
		padding: 3px 4px;
	}
	.hobby:hover {
		background: var(--hilite);
	}
	.hobby .pix {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		image-rendering: pixelated;
	}
	.hobby .lbl strong {
		color: var(--navy);
		font-family: var(--font-arial);
		font-weight: 700;
		font-size: 11px;
	}
	.hobby .lbl small {
		display: block;
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--ink-soft);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	/* Guestbook / footer */
	.footer-grid {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 12px;
	}
	.gb-form {
		background: var(--bg-soft);
		padding: 12px;
	}
	.gb-form .h {
		font-family: var(--font-arial);
		font-weight: 700;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--purple);
		margin: 0 0 8px;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-bottom: 1px dashed var(--ink);
		padding-bottom: 4px;
	}
	.gb-form .h .jp {
		color: var(--ink-soft);
		font-family: var(--font-jp);
		text-transform: none;
		letter-spacing: 0;
		font-size: 10px;
	}
	.gb-form .row {
		display: flex;
		gap: 6px;
		margin-bottom: 6px;
		align-items: center;
	}
	.gb-form label {
		font-family: var(--font-mono);
		font-size: 10px;
		min-width: 60px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	.gb-form input[type='text'],
	.gb-form input[type='email'],
	.gb-form textarea {
		flex: 1;
		font-family: var(--font-jp);
		font-size: 11px;
		padding: 3px 5px;
		background: var(--white);
		color: var(--ink);
		border: 1px solid;
		border-top-color: var(--bevel-lo);
		border-left-color: var(--bevel-lo);
		border-right-color: var(--bevel-hi);
		border-bottom-color: var(--bevel-hi);
		outline: none;
		cursor: text;
	}
	.gb-form textarea {
		resize: none;
		height: 54px;
	}
	.gb-form .actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 8px;
	}
	.gb-form .small {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--ink-soft);
	}
	.gb-form .btn {
		font-family: var(--font-arial);
		font-weight: 700;
		font-size: 11px;
		padding: 3px 14px;
		background: var(--bg-soft);
		color: var(--ink);
		cursor: pointer;
		border: 2px solid;
		border-top-color: var(--bevel-hi);
		border-left-color: var(--bevel-hi);
		border-right-color: var(--bevel-lo);
		border-bottom-color: var(--bevel-lo);
		box-shadow:
			inset -1px -1px 0 var(--bevel-dk),
			inset 1px 1px 0 var(--bg-soft);
	}
	.gb-form .btn:active {
		border-top-color: var(--bevel-lo);
		border-left-color: var(--bevel-lo);
		border-right-color: var(--bevel-hi);
		border-bottom-color: var(--bevel-hi);
	}
	.gb-side {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.gb-side .panel {
		background: var(--white);
		padding: 10px;
		font-family: var(--font-mono);
		font-size: 10px;
	}
	.gb-side .panel .h {
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		border-bottom: 1px dashed var(--ink);
		padding-bottom: 3px;
		margin-bottom: 6px;
		color: var(--teal);
		font-size: 10px;
		overflow: hidden;
	}
	.mail-line {
		font-family: var(--font-mono);
		font-size: 11px;
	}
	.mail-line .at {
		color: var(--red);
		margin: 0 1px;
	}
	.badges {
		display: grid;
		grid-template-columns: 88px 88px;
		gap: 6px;
		justify-content: start;
	}
	.b88 {
		width: 88px;
		height: 31px;
		font-family: var(--font-arial);
		font-size: 9px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		line-height: 1;
		padding: 2px 4px;
		font-weight: 700;
		color: var(--white);
	}
	.b88.navy {
		background: var(--navy);
	}
	.b88.navy .ico {
		color: var(--gold);
		margin-right: 3px;
	}
	.b88.teal {
		background: var(--teal);
		border: 1px solid var(--ink);
	}
	.b88.gold {
		background: linear-gradient(180deg, var(--gold), #b88800);
		color: var(--ink);
		border: 1px solid var(--ink);
	}
	.b88.html {
		background: var(--white);
		color: var(--ink);
		border: 1px solid var(--ink);
		display: grid;
		grid-template-columns: 28px 1fr;
		padding: 0;
	}
	.b88.html .l {
		background: var(--red);
		color: var(--white);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 700;
	}
	.b88.html .r {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0 2px;
		font-size: 7px;
		letter-spacing: 0.06em;
		line-height: 1;
	}
	.b88.purple {
		background: var(--purple);
		border: 1px solid var(--ink);
	}
	.b88.purple .star {
		color: var(--gold);
		margin: 0 2px;
	}
	.b88.notepad {
		background: var(--bg);
		color: var(--ink);
		border: 1px solid var(--ink);
		font-family: var(--font-mono);
		font-size: 8px;
	}
	.colophon {
		text-align: center;
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--ink);
		margin-top: 6px;
		padding: 6px;
		background: var(--bg);
		border-top: 1px solid var(--bevel-lo);
		border-bottom: 1px solid var(--bevel-lo);
	}
	.colophon .heart {
		color: var(--red);
	}
	.colophon .jp-col {
		color: var(--purple);
	}

	/* ── Animations ── */
	@keyframes p97Blink {
		0%,
		49.9% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}
	@keyframes p97Marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-100%);
		}
	}
	@keyframes p97StripeSlide {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 30px 0;
		}
	}
	@keyframes p97NpPulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}
	@keyframes p97Pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
	}
	.p97-pulse {
		animation: p97Pulse 1.4s ease-in-out infinite;
		transform-origin: center;
		display: inline-block;
	}
	.blink {
		animation: p97Blink 0.9s steps(2) infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee .track,
		.gif-divider,
		.skill .bar .fill,
		.blink,
		.p97-pulse,
		.casio .time .sep,
		.np-bar::before {
			animation: none !important;
			transition: none !important;
		}
		.skill.has-loaded .bar .fill {
			width: var(--p);
		}
	}
</style>
