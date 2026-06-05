<script lang="ts">
	import { haptic } from '$lib/utils/haptics';
	import { fade } from 'svelte/transition';

	interface Props {
		currentPath: string;
		onSearchClick?: () => void;
		hidden?: boolean;
	}

	let { currentPath, onSearchClick, hidden = false }: Props = $props();

	function isActive(itemPath: string | undefined, current: string): boolean {
		if (!itemPath) return false;
		return current === itemPath || current.startsWith(itemPath + '/');
	}

	function handleSearch() {
		haptic('light');
		onSearchClick?.();
	}

	function handleNav() {
		haptic('light');
	}
</script>

{#if !hidden}
	<div
		class="pointer-events-none fixed inset-0 z-[55] font-mono"
		in:fade={{ duration: 250, delay: 100 }}
		out:fade={{ duration: 150 }}
		aria-label="Primary navigation"
	>
		<!-- Search -->
		<button
			type="button"
			onclick={handleSearch}
			aria-label="Open search"
			class="pointer-events-auto absolute top-[10%] left-[6%] flex items-center gap-2 focus-ring transition-transform duration-150 hover:scale-105 sm:top-[16%] sm:left-[5%]"
		>
			<img
				src="/assets/star.png"
				alt=""
				class="h-9 w-9 drop-shadow-[0_0_6px_rgba(255,174,251,0.6)] sm:h-11 sm:w-11"
			/>
			<span class="text-sm tracking-wide text-black sm:text-base">Search</span>
		</button>

		<!-- Shop -->
		<a
			href="/shop"
			onclick={handleNav}
			class="pointer-events-auto absolute top-[7%] left-[55%] flex items-center gap-2 focus-ring transition-transform duration-150 hover:scale-105 sm:top-[9%] sm:left-[58%]"
		>
			<img
				src="/assets/star.png"
				alt=""
				class="h-9 w-9 drop-shadow-[0_0_6px_rgba(255,174,251,0.6)] sm:h-11 sm:w-11"
			/>
			<span
				class="text-sm tracking-wide sm:text-base {isActive('/shop', currentPath)
					? 'text-pink'
					: 'text-black'}"
			>
				Shop
			</span>
		</a>

		<!-- What is Omind? -->
		<a
			href="/about"
			onclick={handleNav}
			class="pointer-events-auto absolute top-[19%] left-[22%] flex items-center gap-2 focus-ring transition-transform duration-150 hover:scale-105 sm:top-[30%] sm:left-[13%]"
		>
			<img
				src="/assets/star.png"
				alt=""
				class="h-9 w-9 drop-shadow-[0_0_6px_rgba(255,174,251,0.6)] sm:h-11 sm:w-11"
			/>
			<span
				class="text-sm tracking-wide sm:text-base {isActive('/about', currentPath)
					? 'text-pink'
					: 'text-black'}"
			>
				What is Omind?
			</span>
		</a>

		<!-- Artists -->
		<a
			href="/artists"
			onclick={handleNav}
			class="pointer-events-auto absolute top-[22%] right-[6%] flex items-center gap-2 focus-ring transition-transform duration-150 hover:scale-105 sm:top-[26%] sm:right-[8%]"
		>
			<img
				src="/assets/star.png"
				alt=""
				class="h-9 w-9 drop-shadow-[0_0_6px_rgba(255,174,251,0.6)] sm:h-11 sm:w-11"
			/>
			<span
				class="text-sm tracking-wide sm:text-base {isActive('/artists', currentPath)
					? 'text-pink'
					: 'text-black'}"
			>
				Artists
			</span>
		</a>

		<!-- Music -->
		<a
			href="/playlists"
			onclick={handleNav}
			class="pointer-events-auto absolute top-[70%] left-[12%] flex items-center gap-2 focus-ring transition-transform duration-150 hover:scale-105 sm:top-[68%] sm:left-[9%]"
		>
			<img
				src="/assets/star.png"
				alt=""
				class="h-9 w-9 drop-shadow-[0_0_6px_rgba(255,174,251,0.6)] sm:h-11 sm:w-11"
			/>
			<span
				class="text-sm tracking-wide sm:text-base {isActive('/playlists', currentPath)
					? 'text-pink'
					: 'text-black'}"
			>
				Music
			</span>
		</a>

		<!-- Who the f*** is this? -->
		<a
			href="/wtfis"
			onclick={handleNav}
			class="pointer-events-auto absolute top-[78%] left-[42%] flex items-center gap-2 focus-ring transition-transform duration-150 hover:scale-105 sm:top-[76%] sm:right-[10%] sm:left-auto"
		>
			<img
				src="/assets/star.png"
				alt=""
				class="h-9 w-9 drop-shadow-[0_0_6px_rgba(255,174,251,0.6)] sm:h-11 sm:w-11"
			/>
			<span
				class="text-sm tracking-wide sm:text-base {isActive('/wtfis', currentPath)
					? 'text-pink'
					: 'text-black'}"
			>
				Who the f*** is this?
			</span>
		</a>
	</div>
{/if}
