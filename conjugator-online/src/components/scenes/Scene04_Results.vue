<<template>
    <div class="settings-scene">
      <h1>Results page</h1>
      <p>Game results</p>
      <div v-for="(result, index) in normalizedResults" :key="index">
        <p>Prompt {{ index + 1 }}:</p>
        <p>Verb: {{ result.prompt.verb }}</p>
        <p>Person: {{ result.prompt.person }}</p>
        <p>Tense: {{ result.prompt.tense }}</p>
        <p>Sentence Type: {{ result.prompt['sentence type'] }}</p>
        <p>User Answer: {{ result['user answer'] }}</p>
        <p>Correct: {{ result.correct }}</p>
        <p>Correct Answers: {{ result['correct answer(s)'].join(', ') }}</p>
      </div>
      <button @click="goToScene('Scene02_Settings')">PLAY AGAIN</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
    results: {
      type: Array,
      default: () => [],
    },
  },
    computed: {
        normalizedResults() {
            return this.results; // Already an array, no transformation needed
        },
    },
    methods: {
      goToScene(sceneName) {
        this.$emit('changeScene', sceneName);
      },
    },
  };
  </script>
  