<template>
  <div class="h-full w-full pt-4 sm:pt-16">
    <div>
      <div
        class="sm:w-0112 mx-auto bg-white px-4 py-8 sm:mt-6 sm:w-96 sm:rounded-lg sm:px-10 sm:shadow-xl"
      >
        <div class="mb-6 text-center">
          <span class="text-lg">Log in to your account</span>
        </div>
        <form class="flex flex-col">
          <Input
            label="Email"
            placeholder="johndoe@mail.com"
            v-model="email"
            :type="email !== 'Administrator' ? 'email' : 'text'"
          />
          <Input
            class="mt-4"
            label="Password"
            type="password"
            placeholder="•••••"
            v-model="password"
          />
          <ErrorMessage :error="errorMessage" class="mt-4" />
          <Button
            class="mt-4"
            appearance="primary"
            :disabled="loggingIn"
            :loading="loggingIn"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

// const loggingIn = ref(null)
// const email = ref(null)
// const password = ref(null)
// const errorMessage = ref(null)
// const redirectRoute = ref(null)

// const route = useRoute()
// const router = useRouter()
// onMounted(() => {
//   if (route?.query?.route) {
//     redirectRoute.value = route.query.route
//     router.replace({ query: null })
//   }
// })
// const makeLoginRequest = async () => {
//   if (!email.value || !password.value) {
//     return
//   }
//   try {
//     errorMessage.value = null
//     loggingIn.value = true
//     let res = await auth.login(email.value, password.value)
//     if (res) {
//       router.push(redirectRoute.value || '/')
//     }
//   } catch (error) {
//     console.error(error)
//     errorMessage.value = error.messages.join('\n')
//   } finally {
//     loggingIn.value = false
//   }
// }
</script>
