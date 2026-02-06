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
		{ path: '/shop', label: 'SHOP' },
		{ path: '/events', label: 'EVENTS' }
	];

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Mobile: Hamburger Button -->
<button
	class="fixed left-4 top-4 z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-pink/30 bg-black/80 backdrop-blur-md sm:hidden"
	onclick={() => (isOpen = !isOpen)}
	aria-label={isOpen ? 'Close menu' : 'Open menu'}
	aria-expanded={isOpen}
>
	<span
		class="block h-0.5 w-5 bg-pink transition-all duration-200 {isOpen
			? 'translate-y-2 rotate-45'
			: ''}"
	></span>
	<span
		class="block h-0.5 w-5 bg-pink transition-all duration-200 {isOpen ? 'opacity-0' : ''}"
	></span>
	<span
		class="block h-0.5 w-5 bg-pink transition-all duration-200 {isOpen
			? '-translate-y-2 -rotate-45'
			: ''}"
	></span>
</button>

<!-- Mobile: Menu Overlay -->
{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm sm:hidden"
		transition:fade={{ duration: 200 }}
		onclick={() => (isOpen = false)}
		onkeydown={(e) => e.key === 'Enter' && (isOpen = false)}
		role="button"
		tabindex="-1"
	></div>

	<!-- Menu Panel -->
	<nav
		class="fixed left-0 top-0 z-[55] h-dvh w-64 border-r border-pink/20 bg-black/95 p-6 pt-20 font-mono backdrop-blur-md sm:hidden"
		transition:fly={{ x: -256, duration: 250 }}
	>
		<ul class="space-y-2">
			{#each navItems as item, i (item.path)}
				<li in:fly={{ x: -20, duration: 200, delay: 50 + i * 50 }}>
					<a
						href={item.path}
						class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm uppercase tracking-wider transition-all duration-200
							{currentPath === item.path
							? 'bg-pink/20 text-pink [text-shadow:0_0_10px_#ffaef6]'
							: 'text-pink/70 hover:bg-pink/10 hover:text-pink'}"
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
<nav class="fixed right-6 top-6 z-50 hidden items-center gap-4 font-mono sm:flex">
	{#each navItems as item (item.path)}
		<a
			href={item.path}
			class="text-[0.7rem] uppercase tracking-wider transition-all duration-200
				{currentPath === item.path
				? 'text-pink [text-shadow:0_0_8px_#ffaef6]'
				: 'text-pink/50 hover:text-pink hover:[text-shadow:0_0_8px_#ffaef6]'}"
		>
			[{item.label}]
		</a>
	{/each}
</nav>
