<script>
    import { tags, setTags } from "../store";

    function handleTagChange(e) {
        setTags(e.target.value);
    }
</script>

<details id="tags" class="dimmed" open>
    <summary>Tags</summary>
    <div>
        <input type="text" placeholder="Tags" value={$tags} on:input={handleTagChange}>
    </div>
</details>