<script lang="ts">
	import { haptic } from '$lib/utils/haptics';
	import { SOCIAL_INSTAGRAM, SOCIAL_TIKTOK, SOCIAL_SOUNDCLOUD, SOCIAL_EMAIL } from '$lib/config';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		currentPath: string;
		onSearchClick?: () => void;
	}

	let { currentPath, onSearchClick }: Props = $props();

	let menuOpen = $state(false);

	const navItems = [
		{ path: '/artists', label: 'ARTISTS' },
		{ path: '/articles', label: 'ARTICLES' },
		{ path: '/wtfis', label: 'WTFIS' },
		{ path: '/playlists', label: 'PLAYLISTS & RADIO' }
	];

	function isActive(itemPath: string, current: string): boolean {
		if (itemPath === '/') return current === '/';
		return current === itemPath || current.startsWith(itemPath + '/');
	}

	function openMenu() {
		haptic('light');
		menuOpen = true;
	}

	function closeMenu() {
		haptic('light');
		menuOpen = false;
	}

	function handleSearch() {
		haptic('light');
		menuOpen = false;
		onSearchClick?.();
	}

	function handleNav() {
		haptic('light');
		menuOpen = false;
	}
</script>

<!-- Mobile: Top Navbar -->
<header
	class="fixed inset-x-0 top-0 z-[60] flex h-14 items-center justify-between border-b border-black/30 bg-white px-4 sm:hidden"
>
	<a
		href="/"
		onclick={handleNav}
		aria-label="Omind home"
		class="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus-ring"
	>
		<img src="/assets/icon-192.png" alt="Omind" class="h-9 w-9" />
	</a>

	<div class="-ml-2 flex items-center">
		<button
			type="button"
			onclick={openMenu}
			aria-label="Open menu"
			aria-expanded={menuOpen}
			class="flex h-11 w-8 items-center justify-center text-black focus-ring transition-colors hover:text-pink"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="square"
			>
				<line x1="3" y1="6" x2="21" y2="6" />
				<line x1="3" y1="12" x2="21" y2="12" />
				<line x1="3" y1="18" x2="21" y2="18" />
			</svg>
		</button>

		<button
			type="button"
			onclick={handleSearch}
			aria-label="Search"
			class="flex h-11 w-8 items-center justify-center text-black focus-ring transition-colors hover:text-pink"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="square"
			>
				<circle cx="10.5" cy="10.5" r="6.5" />
				<line x1="15.5" y1="15.5" x2="20" y2="20" />
			</svg>
		</button>

		<button
			type="button"
			onclick={() => haptic('light')}
			aria-label="Cart"
			class="flex h-11 w-8 items-center justify-center text-black focus-ring transition-colors hover:text-pink"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="square"
			>
				<path d="M5 8h14l-1 12H6L5 8Z" />
				<path d="M9 8V6a3 3 0 0 1 6 0v2" />
			</svg>
		</button>
	</div>

	<div class="h-10 w-10" aria-hidden="true"></div>
</header>

<!-- Mobile: Slide-in Menu Drawer -->
{#if menuOpen}
	<button
		type="button"
		class="fixed inset-0 z-[70] cursor-default bg-transparent sm:hidden"
		onclick={closeMenu}
		aria-label="Close menu"
		transition:fade={{ duration: 150 }}
	></button>

	<aside
		class="fixed inset-y-0 left-0 z-[71] flex w-[calc(100%-4.5rem)] max-w-sm flex-col border-r border-black/30 bg-white sm:hidden"
		transition:fly={{ x: -400, duration: 220, opacity: 1 }}
	>
		<div class="flex h-14 items-center justify-end gap-1 border-b border-black/30 px-4">
			<button
				type="button"
				onclick={closeMenu}
				aria-label="Close menu"
				class="flex h-11 w-11 items-center justify-center text-black focus-ring transition-colors hover:text-pink"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="square"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<nav class="flex flex-col">
			{#each navItems as item (item.path)}
				<a
					href={item.path}
					onclick={handleNav}
					class="flex min-h-[56px] items-center border-b border-black/30 px-4 font-mono text-base font-medium tracking-[0.1em] uppercase focus-ring transition-colors
						{isActive(item.path, currentPath) ? 'text-pink' : 'text-black hover:text-pink'}"
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<footer class="mt-auto flex items-center justify-between gap-4 p-4 pb-2">
			<a
				href="https://nabal.fr"
				target="_blank"
				rel="noopener noreferrer"
				class="font-mono text-[0.6rem] tracking-[0.2em] text-black/50 uppercase focus-ring transition-colors hover:text-pink"
			>
				Made by <span class="font-semibold text-pink underline underline-offset-2">nabal</span>
			</a>

			<div class="flex items-center gap-1">
				<a
					href={SOCIAL_INSTAGRAM}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Instagram"
					class="flex h-9 w-9 items-center justify-center text-black focus-ring transition-colors hover:text-pink"
					onclick={() => haptic('light')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="square"
					>
						<rect x="3" y="3" width="18" height="18" rx="4" />
						<circle cx="12" cy="12" r="4" />
						<circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
					</svg>
				</a>
				<a
					href={SOCIAL_TIKTOK}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="TikTok"
					class="flex h-9 w-9 items-center justify-center text-black focus-ring transition-colors hover:text-pink"
					onclick={() => haptic('light')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="square"
						stroke-linejoin="miter"
					>
						<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
						<path d="M14 4c0 2.5 2 4.5 4.5 4.5" />
					</svg>
				</a>
				<a
					href={SOCIAL_SOUNDCLOUD}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="SoundCloud"
					class="flex h-9 w-9 items-center justify-center text-black focus-ring transition-colors hover:text-pink"
					onclick={() => haptic('light')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="-271 345.8 256 111.2"
						fill="currentColor"
					>
						<path
							d="M-238.4,398.1c-0.8,0-1.4,0.6-1.5,1.5l-2.3,28l2.3,27.1c0.1,0.8,0.7,1.5,1.5,1.5c0.8,0,1.4-0.6,1.5-1.5l2.6-27.1l-2.6-28C-237,398.7-237.7,398.1-238.4,398.1z"
						/>
						<path
							d="M-228.2,399.9c-0.9,0-1.7,0.7-1.7,1.7l-2.1,26l2.1,27.3c0.1,1,0.8,1.7,1.7,1.7c0.9,0,1.6-0.7,1.7-1.7l2.4-27.3l-2.4-26C-226.6,400.6-227.3,399.9-228.2,399.9z"
						/>
						<path
							d="M-258.6,403.5c-0.5,0-1,0.4-1.1,1l-2.5,23l2.5,22.5c0.1,0.6,0.5,1,1.1,1c0.5,0,1-0.4,1.1-1l2.9-22.5l-2.9-23C-257.7,404-258.1,403.5-258.6,403.5z"
						/>
						<path
							d="M-268.1,412.3c-0.5,0-1,0.4-1,1l-1.9,14.3l1.9,14c0.1,0.6,0.5,1,1,1s0.9-0.4,1-1l2.2-14l-2.2-14.2C-267.2,412.8-267.6,412.3-268.1,412.3z"
						/>
						<path
							d="M-207.5,373.5c-1.2,0-2.1,0.9-2.2,2.1l-1.9,52l1.9,27.2c0.1,1.2,1,2.1,2.2,2.1s2.1-0.9,2.2-2.1l2.1-27.2l-2.1-52C-205.4,374.4-206.4,373.5-207.5,373.5z"
						/>
						<path
							d="M-248.6,399c-0.7,0-1.2,0.5-1.3,1.3l-2.4,27.3l2.4,26.3c0.1,0.7,0.6,1.3,1.3,1.3c0.7,0,1.2-0.5,1.3-1.2l2.7-26.3l-2.7-27.3C-247.4,399.6-247.9,399-248.6,399z"
						/>
						<path
							d="M-217.9,383.4c-1,0-1.9,0.8-1.9,1.9l-2,42.3l2,27.3c0.1,1.1,0.9,1.9,1.9,1.9s1.9-0.8,1.9-1.9l2.3-27.3l-2.3-42.3C-216,384.2-216.9,383.4-217.9,383.4z"
						/>
						<path
							d="M-154.4,359.3c-1.8,0-3.2,1.4-3.2,3.2l-1.2,65l1.2,26.1c0,1.8,1.5,3.2,3.2,3.2c1.8,0,3.2-1.5,3.2-3.2l1.4-26.1l-1.4-65C-151.1,360.8-152.6,359.3-154.4,359.3z"
						/>
						<path
							d="M-197.1,368.9c-1.3,0-2.3,1-2.4,2.4l-1.8,56.3l1.8,26.9c0,1.3,1.1,2.3,2.4,2.3s2.3-1,2.4-2.4l2-26.9l-2-56.3C-194.7,370-195.8,368.9-197.1,368.9z"
						/>
						<path
							d="M-46.5,394c-4.3,0-8.4,0.9-12.2,2.4C-61.2,368-85,345.8-114,345.8c-7.1,0-14,1.4-20.1,3.8c-2.4,0.9-3,1.9-3,3.7v99.9c0,1.9,1.5,3.5,3.4,3.7c0.1,0,86.7,0,87.3,0c17.4,0,31.5-14.1,31.5-31.5C-15,408.1-29.1,394-46.5,394z"
						/>
						<path
							d="M-143.6,353.2c-1.9,0-3.4,1.6-3.5,3.5l-1.4,70.9l1.4,25.7c0,1.9,1.6,3.4,3.5,3.4c1.9,0,3.4-1.6,3.5-3.5l1.5-25.8l-1.5-70.9C-140.2,354.8-141.7,353.2-143.6,353.2z"
						/>
						<path
							d="M-186.5,366.8c-1.4,0-2.5,1.1-2.6,2.6l-1.6,58.2l1.6,26.7c0,1.4,1.2,2.6,2.6,2.6s2.5-1.1,2.6-2.6l1.8-26.7l-1.8-58.2C-184,367.9-185.1,366.8-186.5,366.8z"
						/>
						<path
							d="M-175.9,368.1c-1.5,0-2.8,1.2-2.8,2.8l-1.5,56.7l1.5,26.5c0,1.6,1.3,2.8,2.8,2.8s2.8-1.2,2.8-2.8l1.7-26.5l-1.7-56.7C-173.1,369.3-174.3,368.1-175.9,368.1z"
						/>
						<path
							d="M-165.2,369.9c-1.7,0-3,1.3-3,3l-1.4,54.7l1.4,26.3c0,1.7,1.4,3,3,3c1.7,0,3-1.3,3-3l1.5-26.3l-1.5-54.7C-162.2,371.3-163.5,369.9-165.2,369.9z"
						/>
					</svg>
				</a>
				<a
					href="mailto:{SOCIAL_EMAIL}"
					aria-label="Email"
					class="flex h-9 w-9 items-center justify-center text-black focus-ring transition-colors hover:text-pink"
					onclick={() => haptic('light')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="square"
						stroke-linejoin="miter"
					>
						<rect x="3" y="5" width="18" height="14" />
						<path d="m3 7 9 6 9-6" />
					</svg>
				</a>
			</div>
		</footer>
	</aside>
{/if}

<!-- Desktop: Horizontal Nav (unchanged) -->
<nav class="fixed top-6 right-6 z-50 hidden items-center gap-6 font-mono sm:flex">
	{#each navItems as item (item.path)}
		<a
			href={item.path}
			class="text-[0.65rem] tracking-[0.2em] uppercase focus-ring transition-opacity duration-150
				{isActive(item.path, currentPath) ? 'text-pink' : 'text-black/40 hover:text-pink'}"
		>
			{item.label}
		</a>
	{/each}
</nav>
