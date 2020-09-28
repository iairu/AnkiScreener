<script>
    import { captureScreenshot } from "../controller";

    let img;
</script>

{#await captureScreenshot() then base64jpeg}
    <img id="screenshot" src={"data:image/jpeg;base64,"+base64jpeg} alt="Screenshot" bind:this={img}>
{/await}