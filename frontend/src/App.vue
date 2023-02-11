<template>
  <div>
    <router-view />
  </div>
  <Dialogs />
</template>

<script setup>
import { Dialogs } from '@/utils/dialogs'
</script>
