<script lang="ts">
	import { fly, fade } from 'svelte/transition';
</script>

<div class="flex h-dvh w-screen flex-col items-center justify-center bg-black font-mono text-pink">
	<div class="text-center" in:fade={{ duration: 200 }}>
		<h1
			class="mb-4 text-3xl font-normal tracking-[0.2em] uppercase"
			in:fly={{ y: -15, duration: 300 }}
		>
			PLAYLISTS
		</h1>
		<p
			class="text-[0.7rem] tracking-[0.3em] text-pink/30 uppercase"
			in:fly={{ y: 15, duration: 300, delay: 80 }}
		>
			COMING SOON
		</p>

		<div class="mt-8" in:fly={{ y: 15, duration: 300, delay: 160 }}>
			<a
				href="/"
				class="border border-pink/10 bg-black px-5 py-2 text-[0.65rem] tracking-[0.2em] text-pink/40 uppercase transition-opacity duration-150 hover:text-pink"
			>
				BACK
			</a>
		</div>
	</div>
</div>
