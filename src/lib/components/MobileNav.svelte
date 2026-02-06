<script lang="ts">
	interface Props {
		currentPath: string;
	}

	let { currentPath }: Props = $props();

	const navItems = [
		{ path: '/', label: 'EXPLORE' },
		{ path: '/articles', label: 'ARTICLES' },
		{ path: '/playlists', label: 'PLAYLISTS' }
	];

	function isActive(itemPath: string, current: string): boolean {
		if (itemPath === '/') return current === '/';
		return current === itemPath || current.startsWith(itemPath + '/');
	}
</script>

<!-- Mobile: Top Logo -->
<div class="pointer-events-none fixed inset-x-0 top-4 z-30 flex justify-center sm:hidden">
	<img src="/assets/icon-512.png" alt="0mind" class="h-10 w-10 opacity-60" />
</div>

<!-- Mobile: Bottom Tab Bar -->
<nav
	class="fixed inset-x-0 bottom-0 z-[60] flex items-center border-t border-pink/10 bg-black font-mono sm:hidden"
>
	{#each navItems as item (item.path)}
		<a
			href={item.path}
			class="flex flex-1 items-center justify-center py-4 text-[0.55rem] tracking-[0.2em] uppercase transition-opacity duration-150
				{isActive(item.path, currentPath) ? 'text-pink' : 'text-pink/30 hover:text-pink'}"
		>
			{item.label}
		</a>
	{/each}
</nav>

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
