<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer />
      <v-text-field
        v-model="search"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Поиск"
        @input="getPackages($event)"
      />
      <v-spacer />
    </v-app-bar>

    <v-main class="brown lighten-5">
      <v-container>
        <v-card v-if="search">
          <v-card-title>Результаты Поиска</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="packages"
              :loading="table.loading"
              :footer-props="{'disable-items-per-page': true}"
            >
              <template #item.name="{item: {name}}">
                <a class="text-decoration-none" href="#" @click.prevent="openModal(name)">
                  <span>{{name}}</span>
                </a>
              </template>
              <template #no-data>По запросу "{{search}}" данные отсутствуют...</template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <div v-else class="text-h4 text--disabled text-center pt-10">Начните поиск</div>
      </v-container>
    </v-main>

    <v-footer class="justify-center">
      <div>
        <a
          href="https://github.com/maluzhenkov"
          target="_blank"
          rel="noopener noreferrer"
        >Николай Малюженков</a>
        &copy; {{ currentYear }}
      </div>
    </v-footer>

    <!-- Modals -->
    <v-dialog v-model="modal.show" max-width="500">
      <v-card :loading="modal.loading">
        <v-toolbar flat>
          <v-toolbar-title>{{packageInfo.name}}</v-toolbar-title>
          <v-divider class="mx-4" vertical inset />
          <v-btn
            :href="packageInfo.github"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            outlined
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
          <v-btn
            class="ml-4"
            target="_blank"
            rel="noopener noreferrer"
            :href="packageInfo.homepage"
            title="Home Page"
            outlined
          >
            <v-icon>mdi-web</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn icon @click="modal.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-subtitle class="pt-6">
          Автор:
          <b>{{packageInfo.author}}</b>
          <br />Последняя версия:
          <b>{{packageInfo.lastversion}}</b>
        </v-card-subtitle>
        <v-card-text>
          <h4 class="mb-2">Описание:</h4>
          <p>{{packageInfo.description}}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { debounce } from "@/plugins/utils";

export default {
  name: "App",
  data: () => ({
    search: "",
    table: {
      loading: false
    },
    modal: {
      show: false,
      loading: false,
      info: null
    }
  }),
  computed: {
    // Table
    headers() {
      return [
        { text: "Последняя версия", value: "lastversion" },
        { text: "Наименование", value: "name" },
        { text: "Автор", value: "author" }
      ];
    },
    packages() {
      return this.$store.getters.getPackages;
    },
    // Modals
    packageInfo() {
      return this.$store.getters.getPackage;
    },
    // Footer
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    openModal(packageName) {
      this.modal.show = this.modal.loading = true;
      this.$store
        .dispatch("fetchPackageInfo", packageName)
        .catch(err => {
          console.error(err.message);
          alert(err.message);
        })
        .finally(() => {
          this.modal.loading = false;
        });
    },
    getPackages: debounce(function() {
      this.table.loading = true;
      if (this.search) {
        this.$store
          .dispatch("fetchPackages", this.search + "*")
          .catch(err => {
            console.error(err.message);
            alert(err.message);
          })
          .finally(() => {
            this.table.loading = false;
          });
      }
    }, 300)
  }
};
</script>
