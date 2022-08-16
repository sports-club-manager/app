<script>
    import Section from "$lib/components/Section.svelte";
    import moment from "moment-timezone";
    import { marked } from "marked";

    export let data;
    let infoPage = data.infoPage;
</script>

<Section fab="icon:bookmark" container={true}>
    <div slot="section-head">
        <h4>{infoPage.title}</h4>
        created: {moment(infoPage.created).tz("Europe/London").format("DD MMM yyyy, HH:mm")}
    </div>

    <div slot="section-body">
        {@html marked(infoPage.body)}
    </div>
</Section>

<style>
    * :global(h2) {
        font-size: x-large;
    }
    * :global(h3) {
        font-size: large;
        font-weight: bold;
    }
</style>
