<script>
	import { isCapturing, isHidden, isScreenshotting } from './store.js';
	import { registerGlobalKeybinds, unregisterGlobalKeybinds } from './controller.js';
	import { onMount } from 'svelte';
	
	import Top from './menu/Top.svelte';
	import Groups from './menu/Groups.svelte';
	import Tags from './menu/Tags.svelte';
	import Keybinds from './menu/Keybinds.svelte';
	
	import Canvas from './menu/Canvas.svelte';
	import Screenshot from './selections/Screenshot.svelte';

	onMount(()=>{
		registerGlobalKeybinds();
		return ()=>{
			unregisterGlobalKeybinds();
		};
	});
</script>

<style lang="scss" global>
	@import "App.scss";
</style>

{#if !$isScreenshotting}
	<menu>
		<Top />
		{#if $isCapturing && !$isHidden}
		<div class="capturing">
			<Groups />
			<Tags />
			<Keybinds />
		</div>
		{/if}
	</menu>

	{#if $isCapturing}
		<Canvas />
	{/if}
{/if}

{#if $isCapturing}
	<Screenshot />
{/if}