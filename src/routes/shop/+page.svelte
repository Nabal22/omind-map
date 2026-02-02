<script lang="ts">
	import { fly, fade } from 'svelte/transition';
</script>

<div class="flex h-dvh w-screen flex-col items-center justify-center bg-black font-mono text-pink">
	<div class="text-center" in:fade={{ duration: 300 }}>
		<h1
			class="mb-4 text-4xl font-bold uppercase tracking-wider [text-shadow:0_0_20px_#ffaef6]"
			in:fly={{ y: -20, duration: 400 }}
		>
			SHOP
		</h1>
		<p
			class="text-sm uppercase tracking-widest text-pink/60"
			in:fly={{ y: 20, duration: 400, delay: 100 }}
		>
			[COMING SOON]
		</p>

		<div class="mt-8" in:fly={{ y: 20, duration: 400, delay: 200 }}>
			<a
				href="/"
				class="rounded-full border border-pink/30 bg-black/60 px-6 py-2 text-[0.7rem] uppercase backdrop-blur-sm transition-all duration-200 hover:border-pink/60 hover:bg-pink/10 hover:[text-shadow:0_0_8px_#ffaef6]"
			>
				← BACK TO GLOBE
			</a>
		</div>
	</div>
</div>
