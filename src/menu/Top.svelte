<script>
    import { exitApp, devTools, restartApp, setSavePath, shortPathFileName } from "../controller";
    import { isDev, 
             isCapturing, startCapturing, stopCapturing,
             hasMenuHidden, hideMenu, showMenu,
             csvPath, turnQAon, turnQAoff, isQAmode} from "../store";
</script>

<div id="top" class="buttonRow">
    <button aria-label="Exit the app" on:click={exitApp}>X</button>
    {#if !$isQAmode}
        <button aria-label="Turn QA mode ON" on:click={turnQAon}>QA</button>
    {:else}
        <button aria-label="Turn QA mode OFF" on:click={turnQAoff}>G</button>
    {/if}
    <button aria-label="Choose a CSV output" on:click={setSavePath}
            style="max-width: 75px; text-overflow: ellipsis; white-space: nowrap;">
        {$csvPath ? ">> " + shortPathFileName($csvPath) : "Save to"}
    </button>

{#if !$isCapturing}
    <button aria-label="Start capturing" on:click={startCapturing}>TAB</button>
{:else}
    <button aria-label="Stop capturing" on:click={stopCapturing}>ESC</button>
    {#if !$hasMenuHidden}
        <button aria-label="Hide additional info" on:click={hideMenu}>/\</button>
    {:else}
        <button aria-label="Show additional info" on:click={showMenu}>\/</button>
    {/if}
{/if}

{#if $isDev}
    <button class="dev" aria-label="Launch dev tools" on:click={devTools}>DT</button>
    <button class="dev" aria-label="Restart the app" on:click={restartApp}>R</button>
{/if}

</div>