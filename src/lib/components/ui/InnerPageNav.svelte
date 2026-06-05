<script lang="ts">
	import { haptic } from '$lib/utils/haptics';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		currentPath: string;
		onSearchClick?: () => void;
	}

	let { currentPath, onSearchClick }: Props = $props();

	let menuOpen = $state(false);

	const navItems = [
		{ path: '/about', label: 'WHAT IS OMIND?' },
		{ path: '/shop', label: 'SHOP' },
		{ path: '/artists', label: 'ARTISTS' },
		{ path: '/playlists', label: 'MUSIC' },
		{ path: '/wtfis', label: 'WHO THE F*** IS THIS?' }
	];

	function isActive(itemPath: string, current: string): boolean {
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

<header
	class="fixed inset-x-0 top-0 z-[60] flex h-14 items-center border-b border-black/20 bg-white/90 px-3 backdrop-blur-sm sm:hidden"
>
	<button
		type="button"
		onclick={openMenu}
		aria-label="Open menu"
		aria-expanded={menuOpen}
		class="flex h-11 w-11 items-center justify-center text-black focus-ring transition-colors hover:text-pink-highlight"
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
		class="flex h-11 w-11 items-center justify-center text-black focus-ring transition-colors hover:text-pink-highlight"
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
</header>

{#if menuOpen}
	<button
		type="button"
		class="fixed inset-0 z-[70] cursor-default bg-black/20 sm:hidden"
		onclick={closeMenu}
		aria-label="Close menu"
		transition:fade={{ duration: 150 }}
	></button>

	<aside
		class="fixed inset-y-0 left-0 z-[71] flex w-[calc(100%-4.5rem)] max-w-sm flex-col border-r border-black/20 bg-white sm:hidden"
		transition:fly={{ x: -400, duration: 220, opacity: 1 }}
	>
		<div class="flex h-14 items-center justify-end border-b border-black/20 px-3">
			<button
				type="button"
				onclick={closeMenu}
				aria-label="Close menu"
				class="flex h-11 w-11 items-center justify-center text-black focus-ring transition-colors hover:text-pink-highlight"
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
			<a
				href="/"
				onclick={handleNav}
				class="flex min-h-[56px] items-center gap-3 border-b border-black/20 px-4 font-mono text-base font-medium tracking-[0.1em] uppercase focus-ring transition-colors {currentPath ===
				'/'
					? 'text-pink'
					: 'text-black hover:text-pink-highlight'}"
			>
				<img src="/assets/star.png" alt="" class="h-6 w-6" />
				Home
			</a>
			{#each navItems as item (item.path)}
				<a
					href={item.path}
					onclick={handleNav}
					class="flex min-h-[56px] items-center gap-3 border-b border-black/20 px-4 font-mono text-base font-medium tracking-[0.1em] uppercase focus-ring transition-colors {isActive(
						item.path,
						currentPath
					)
						? 'text-pink'
						: 'text-black hover:text-pink-highlight'}"
				>
					<img src="/assets/star.png" alt="" class="h-6 w-6" />
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>
{/if}
