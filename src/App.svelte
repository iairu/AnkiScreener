<script>
	import { isCapturing, hasMenuHidden, isScreenshotting, isQAmode } from './store.js';
	import { registerGlobalKeybinds, unregisterGlobalKeybinds } from './controller.js';
	import { onMount } from 'svelte';
	
	import Top from './menu/Top.svelte';
	import QA from './menu/QA.svelte';
	import Groups from './menu/Groups.svelte';
	import Tags from './menu/Tags.svelte';
	import Keybinds from './menu/Keybinds.svelte';
	
	import Selections from './canvas/Selections.svelte';
	import Screenshot from './canvas/Screenshot.svelte';

	import Notify from './other/Notify.svelte';

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
		{#if $isCapturing && !$hasMenuHidden}
		<div class="capturing">
			{#if $isQAmode}
			<QA />
			{:else}
			<Groups />
			{/if}
			<Tags />
			<Keybinds />
		</div>
		{/if}
	</menu>

	{#if $isCapturing}
		<Selections />
	{/if}

	<Notify />
{/if}

{#if $isCapturing}
	<Screenshot />
{/if}
