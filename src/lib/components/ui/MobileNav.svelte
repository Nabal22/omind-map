<script lang="ts">
	interface Props {
		currentPath: string;
		isExplorePage?: boolean;
	}

	let { currentPath, isExplorePage = false }: Props = $props();

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

<!-- Mobile: Top Logo (hidden on non-explore pages to avoid clash with mini globe) -->
{#if isExplorePage}
	<div class="pointer-events-none fixed inset-x-0 top-4 z-30 flex justify-center sm:hidden">
		<img src="/assets/icon-512.png" alt="0mind" class="h-14 w-14" />
	</div>
{/if}

<!-- Mobile: Bottom Tab Bar -->
<nav
	class="fixed inset-x-0 bottom-0 z-[60] flex items-center border-t border-black/10 bg-white pb-safe font-mono sm:hidden"
>
	{#each navItems as item (item.path)}
		<a
			href={item.path}
			class="flex min-h-[44px] flex-1 items-center justify-center px-2 py-3 text-[0.65rem] tracking-[0.15em] font-medium uppercase transition-opacity duration-150
				{isActive(item.path, currentPath) ? 'text-pink' : 'text-black/80 hover:text-pink'}"
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
				{isActive(item.path, currentPath) ? 'text-pink' : 'text-black/40 hover:text-pink'}"
		>
			{item.label}
		</a>
	{/each}
</nav>
