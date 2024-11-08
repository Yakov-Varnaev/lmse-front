<template>
  <v-row>
    <v-col>
      <v-btn block color="primary" @click="$emit('submit')">Submit</v-btn>
    </v-col>
    <v-col>
      <v-btn block color="red" @click="$emit('cancel')">Cancel</v-btn>
    </v-col>
  </v-row>
</template>
