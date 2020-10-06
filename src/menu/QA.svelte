<script>
    import { QAaffixes, setQAaffixes } from "../store";
</script>

<div id="groups">
    <details class="group" open>
        <summary><dot style="background:red"/> Questions</summary>
        <div>
            <input type="text" name="prefix" placeholder="Prefix" value={$QAaffixes.question.prefix} on:input={(e)=>{setQAaffixes({question:{prefix:e.target.value}})}}><br>
            <input type="text" name="suffix" placeholder="Suffix" value={$QAaffixes.question.suffix} on:input={(e)=>{setQAaffixes({question:{suffix:e.target.value}})}}>
        </div>
    </details>
    <details class="group" open>
        <summary><dot style="background:lime"/> Answers</summary>
        <div>
            <input type="text" name="prefix" placeholder="Prefix" value={$QAaffixes.answer.prefix} on:input={(e)=>{setQAaffixes({answer:{prefix:e.target.value}})}}><br>
            <input type="text" name="suffix" placeholder="Suffix" value={$QAaffixes.answer.suffix} on:input={(e)=>{setQAaffixes({answer:{suffix:e.target.value}})}}>
        </div>
    </details>
</div>