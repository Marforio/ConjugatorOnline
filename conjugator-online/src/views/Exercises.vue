<template>
<v-container class="mt-6">
    <v-table>
        <thead>
            <tr>
            <th>Error Code</th>
            <th>Description</th>
            <th>Exercise Link</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(entry, code) in errorList" :key="code">
            <td>{{ code }}</td>
            <td>{{ entry.description }}</td>
            <td>
                <RouterLink :to="`/exercises/${code}`" class="text-primary">
                Go to exercise
                </RouterLink>
            </td>
            </tr>
        </tbody>
    </v-table>
</v-container>
</template>


<script setup>
import { computed } from "vue";
import TopNavBar from '@/components/TopNavBar.vue';
import { errorsData } from "@/assets/scripts/errorsData";

defineOptions({
  name: "Exercises",
  components: { TopNavBar }
});

const errorList = computed(() => errorsData);
</script>
