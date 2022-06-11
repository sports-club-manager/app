<script>
    import moment from "moment-timezone";
    import Section from "$lib/components/Section.svelte";
    import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";

    export let news;

    let time = (dateTime) => moment(dateTime).tz("Europe/London").format("dddd, HH:mm");
</script>

<Section fab="icon:feed" container={true}>
    <div slot="section-head">
        <h4>News</h4>
        Updates and announcements made during the tournament
    </div>

    <div slot="section-body">
        <div class="accordion-container">
            <Accordion>
                {#each news as { title, created, body }}
                    <Panel>
                        <Header>
                            {title}
                            <span slot="description"><small>{time(created)}</small></span>
                        </Header>
                        <Content>{body}</Content>
                    </Panel>
                {/each}
            </Accordion>
        </div>
    </div>
</Section>
