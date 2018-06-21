<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        Turtle Explorer
      </h1>
      <h2 class="subtitle">
        Turtle Explorer
      </h2>
      <div class="tile is-ancestor">
        <div class="tile">
          <h2>Nodes</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc commodo, purus a volutpat ultricies, velit dolor vehicula mauris, nec congue lacus mi id purus. Praesent accumsan lorem ut tellus finibus, pulvinar elementum turpis blandit. Etiam eu maximus massa. Vivamus sed erat accumsan libero feugiat aliquam. Quisque posuere sed nulla vitae tempus. Etiam efficitur sem quis mi dignissim ultricies. Maecenas ullamcorper luctus nunc sed feugiat. Etiam accumsan sem a ultrices placerat. Praesent tempor risus ut libero congue scelerisque.
          </p>
        </div>
        <div class="tile">
          <h2>Pools</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc commodo, purus a volutpat ultricies, velit dolor vehicula mauris, nec congue lacus mi id purus. Praesent accumsan lorem ut tellus finibus, pulvinar elementum turpis blandit. Etiam eu maximus massa. Vivamus sed erat accumsan libero feugiat aliquam. Quisque posuere sed nulla vitae tempus. Etiam efficitur sem quis mi dignissim ultricies. Maecenas ullamcorper luctus nunc sed feugiat. Etiam accumsan sem a ultrices placerat. Praesent tempor risus ut libero congue scelerisque.
          </p>
        </div>
        <div class="tile">
          <h2>Blocks</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc commodo, purus a volutpat ultricies, velit dolor vehicula mauris, nec congue lacus mi id purus. Praesent accumsan lorem ut tellus finibus, pulvinar elementum turpis blandit. Etiam eu maximus massa. Vivamus sed erat accumsan libero feugiat aliquam. Quisque posuere sed nulla vitae tempus. Etiam efficitur sem quis mi dignissim ultricies. Maecenas ullamcorper luctus nunc sed feugiat. Etiam accumsan sem a ultrices placerat. Praesent tempor risus ut libero congue scelerisque.
          </p>
        </div>
        <div class="tile">
          <h2>Help</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc commodo, purus a volutpat ultricies, velit dolor vehicula mauris, nec congue lacus mi id purus. Praesent accumsan lorem ut tellus finibus, pulvinar elementum turpis blandit. Etiam eu maximus massa. Vivamus sed erat accumsan libero feugiat aliquam. Quisque posuere sed nulla vitae tempus. Etiam efficitur sem quis mi dignissim ultricies. Maecenas ullamcorper luctus nunc sed feugiat. Etiam accumsan sem a ultrices placerat. Praesent tempor risus ut libero congue scelerisque.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #eee;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #eee;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
