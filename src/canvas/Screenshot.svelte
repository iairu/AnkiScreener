<script>
    import { captureScreenshot } from "../controller";
    import { setScreenshotElm } from "../store";
    
    function saveImg(e) {
        setScreenshotElm(e.target);
    }
</script>

{#await captureScreenshot() then base64jpeg}
    <img id="screenshot" src={"data:image/jpeg;base64,"+base64jpeg} alt="Screenshot" on:load={saveImg}>
{/await}