<script lang="ts">
	import { haptic } from '$lib/utils/haptics';
	import { SOCIAL_INSTAGRAM, SOCIAL_TIKTOK } from '$lib/config';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		currentPath: string;
		onSearchClick?: () => void;
	}

	let { currentPath, onSearchClick }: Props = $props();

	let menuOpen = $state(false);

	const navItems = [
		{ path: '/', label: 'EXPLORE' },
		{ path: '/artists', label: 'ARTISTS' },
		{ path: '/articles', label: 'ARTICLES' },
		{ path: '/wtfis', label: 'WTFIS' }
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
