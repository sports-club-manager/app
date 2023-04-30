<script>
    // @ts-nocheck
    import "$lib/global.scss";
    import { goto } from "$app/navigation";

    import Drawer, { Content, Header, Title, Subtitle, Scrim } from "@smui/drawer";
    import List, { Item, Text, Graphic, Separator, Subheader, PrimaryText, SecondaryText } from "@smui/list";

    export let tournament,
        pages,
        user,
        open = false;

    let active = "Home";

    function setActive(value, location) {
        active = value;
        open = false;
        if (location) goto(location);
    }
</script>

<Drawer variant="modal" fixed={false} bind:open>
    <Header>
        <Title>
            {tournament.club}
        </Title>
        <Subtitle>{tournament.name}</Subtitle>
    </Header>
    <Content>
        {#if user && user.name}
            <List twoLine avatarList>
                <Item>
                    <Graphic class="avatar" style="background-image: url({user.image})" />
                    <Text>
                        <PrimaryText>{user.name} ({user.role})</PrimaryText>
                        <SecondaryText>{user.email}</SecondaryText>
                    </Text>
                </Item>
            </List>
        {/if}
        <List>
            {#if !user?.name}
                <Item href="#" on:click={() => goto(`/auth/signin`)}>
                    <Graphic class="material-icons" aria-hidden="true">login</Graphic>
                    <Text>Login</Text>
                </Item>
            {:else}
                <Item href="#" on:click={() => goto(`/auth/signout`)}>
                    <Graphic class="material-icons" aria-hidden="true">logout</Graphic>
                    <Text>Logout</Text>
                </Item>
            {/if}

            <Item href="#" on:click={() => setActive("Home", "/")} activated={active === "Home"}>
                <Graphic class="material-icons" aria-hidden="true">home</Graphic>
                <Text>Home</Text>
            </Item>

            {#if user && user?.role != "guest"}
                <Separator />
                <Subheader>Tournament Admin</Subheader>

                <Item
                    href="#"
                    on:click={() => setActive("AdminResults", "/admin/results/all")}
                    activated={active === "AdminResults"}
                >
                    <Graphic class="material-icons" aria-hidden="true">edit_square</Graphic>
                    <Text>Enter Results</Text>
                </Item>
            {/if}

            <Separator />
            <Subheader>Tournament Information</Subheader>

            {#if tournament.siteMap}
                <Item href={tournament.siteMap}>
                    <Graphic class="material-icons" aria-hidden="true">fmd_good</Graphic>
                    <Text>Site Location Map</Text>
                </Item>
            {/if}
            <Item href="#" on:click={() => setActive("News", "/news")} activated={active === "News"}>
                <Graphic class="material-icons" aria-hidden="true">feed</Graphic>
                <Text>Announcements</Text>
            </Item>
            {#each pages as page}
                <Item href="#" on:click={() => setActive(page.title, `/pages/${page.title}`)} activated={active === page.title}>
                    <Graphic class="material-icons" aria-hidden="true">bookmark</Graphic>
                    <Text>{page.title}</Text>
                </Item>
            {/each}
        </List>
    </Content>
</Drawer>
<Scrim />
