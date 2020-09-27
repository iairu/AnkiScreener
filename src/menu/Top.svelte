<script>
    import { exitApp, devTools, restartApp } from "../controller";
    import { isDev, 
             isCapturing, startCapturing, stopCapturing,
             isHidden, hide, show,
             csv, setCsv } from "../store";
</script>

<div id="top" class="buttonRow">
    <button aria-label="Exit the app" on:click={exitApp}>X</button>
    <button aria-label="Choose a CSV output" on:click={setCsv}
            style="max-width: 75px; text-overflow: ellipsis; white-space: nowrap;">
        {$csv ? $csv : "Save to"}
    </button>

{#if !$isCapturing}
    <button aria-label="Start capturing" on:click={startCapturing}>F8</button>
{:else}
    <button aria-label="Stop capturing" on:click={stopCapturing}>ESC</button>
    {#if !$isHidden}
        <button aria-label="Hide additional info" on:click={hide}>/\</button>
    {:else}
        <button aria-label="Show additional info" on:click={show}>\/</button>
    {/if}
{/if}

{#if $isDev}
    <button class="dev" aria-label="Launch dev tools" on:click={devTools}>DT</button>
    <button class="dev" aria-label="Restart the app" on:click={restartApp}>R</button>
{/if}

</div>