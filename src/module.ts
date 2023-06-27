import { defineNuxtModule, createResolver, addImportsDir, addComponentsDir, installModule } from '@nuxt/kit'
import { fileURLToPath } from 'url'
import { defu } from 'defu'

export type ModuleOptions = {
  cloudName?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/cloudinary',
    configKey: 'cloudinary'
  },
  defaults: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.cloudinary = defu(nuxt.options.runtimeConfig.public.cloudinary, {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || options.cloudName,
    })

    if (!nuxt.options.runtimeConfig.public.cloudinary?.cloudName) console.warn('`[@nuxtjs/cloudinary]` Environment variable `CLOUDINARY_CLOUD_NAME` or property `cloudinary.cloudName` missing')

    installModule('@nuxt/image-edge')

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    addImportsDir(resolver.resolve(runtimeDir, 'composables'))
    addComponentsDir({
      path: resolver.resolve(runtimeDir, 'components'),
      pathPrefix: false,
      prefix: '',
      // @ts-ignore
      level: 999,
      global: true
    })
  }
})