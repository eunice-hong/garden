---
title: Jetpack Compose remember
description: Jetpack Compose remember
alias:
  - "remember"
---

```kotlin
// ...
/**
 * Remember the value produced by [calculation]. [calculation] will only be evaluated during the
 * composition. Recomposition will always return the value produced by composition.
 */
@Composable
inline fun <T> remember(crossinline calculation: @DisallowComposableCalls () -> T): T =
    currentComposer.cache(false, calculation)

// ...

/**
 * A Compose compiler plugin API. DO NOT call directly.
 *
 * Cache, that is remember, a value in the composition data of a composition. This is used to
 * implement [remember] and used by the compiler plugin to generate more efficient calls to
 * [remember] when it determines these optimizations are safe.
 */
@ComposeCompilerApi
inline fun <T> Composer.cache(invalid: Boolean, block: @DisallowComposableCalls () -> T): T {
    @Suppress("UNCHECKED_CAST")
    return rememberedValue().let {
        if (invalid || it === Composer.Empty) {
            val value = block()
            updateRememberedValue(value)
            value
        } else it
    } as T
}
// ...
```
