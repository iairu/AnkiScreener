<script>
    import { groups } from "../store";
</script>

<div id="groups">
{#each $groups as group, i}
    <details class="group">
        <summary>
            <input type="text" placeholder={"Group " + (i + 1)} value={group[4]}>
        </summary>
        <div>
            <input type="text" name="prefix" id="group_n_prefix" placeholder="Prefix" value={group[5]}><br>
            <input type="text" name="suffix" id="group_n_suffix" placeholder="Suffix" value={group[6]}>
        </div>
    </details>
{/each}
</div>