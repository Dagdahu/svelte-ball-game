<script>
    import { Navbar, NavbarBrand } from 'sveltestrap';
</script>

<style>
    h1 {
        font-family: 'Fascinate', cursive;
    }
</style>

<Navbar color="light">
    <NavbarBrand>
        <h1 class="text-secondary font-weight-bold">
            <slot />
        </h1>
    </NavbarBrand>
</Navbar>
