<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	interface Props {
		currentPath: string;
	}

	let { currentPath }: Props = $props();
	let isOpen = $state(false);

	const navItems = [
		{ path: '/', label: 'HOME' },
		{ path: '/articles', label: 'ARTICLES' },
		{ path: '/playlists', label: 'PLAYLISTS' }
	];

	function isActive(itemPath: string, current: string): boolean {
		if (itemPath === '/') return current === '/';
		return current === itemPath || current.startsWith(itemPath + '/');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Mobile: Hamburger Button -->
<button
	class="fixed top-4 left-4 z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-pink/20 bg-black sm:hidden"
	onclick={() => (isOpen = !isOpen)}
	aria-label={isOpen ? 'Close menu' : 'Open menu'}
	aria-expanded={isOpen}
>
	<span
		class="block h-px w-5 bg-pink transition-all duration-200 {isOpen
			? 'translate-y-[7px] rotate-45'
			: ''}"
	></span>
	<span class="block h-px w-5 bg-pink transition-all duration-200 {isOpen ? 'opacity-0' : ''}"
	></span>
	<span
		class="block h-px w-5 bg-pink transition-all duration-200 {isOpen
			? '-translate-y-[7px] -rotate-45'
			: ''}"
	></span>
</button>

<!-- Mobile: Menu Overlay -->
{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/80 sm:hidden"
		transition:fade={{ duration: 150 }}
		onclick={() => (isOpen = false)}
		onkeydown={(e) => e.key === 'Enter' && (isOpen = false)}
		role="button"
		tabindex="-1"
	></div>

	<!-- Menu Panel -->
	<nav
		class="fixed top-0 left-0 z-[55] h-dvh w-64 border-r border-pink/10 bg-black p-6 pt-20 font-mono sm:hidden"
		transition:fly={{ x: -256, duration: 200 }}
	>
		<ul class="space-y-0">
			{#each navItems as item, i (item.path)}
				<li in:fly={{ x: -20, duration: 150, delay: 50 + i * 40 }}>
					<a
						href={item.path}
						class="flex items-center border-b border-pink/10 px-0 py-3 text-[0.7rem] tracking-[0.2em] uppercase transition-opacity duration-150
							{isActive(item.path, currentPath) ? 'text-pink' : 'text-pink/40 hover:text-pink'}"
						onclick={() => (isOpen = false)}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<!-- Desktop: Horizontal Nav -->
<nav class="fixed top-6 right-6 z-50 hidden items-center gap-6 font-mono sm:flex">
	{#each navItems as item (item.path)}
		<a
			href={item.path}
			class="text-[0.65rem] tracking-[0.2em] uppercase transition-opacity duration-150
				{isActive(item.path, currentPath) ? 'text-pink' : 'text-pink/40 hover:text-pink'}"
		>
			{item.label}
		</a>
	{/each}
</nav>
