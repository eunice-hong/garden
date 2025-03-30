---
title: ReusableComposeNode
description: Emits a recyclable node into the composition of type [T].
date: 2025-03-23
noindex: false
alias:
---

```kotlin

/**
 * Emits a recyclable node into the composition of type [T].
 *
 * This function will throw a runtime exception if [E] is not a subtype of the applier of the
 * [currentComposer].
 *
 * @sample androidx.compose.runtime.samples.CustomTreeComposition
 *
 * @param factory A function which will create a new instance of [T]. This function is NOT
 * guaranteed to be called in place.
 * @param update A function to perform updates on the node. This will run every time emit is
 * executed. This function is called in place and will be inlined.
 *
 * @see Updater
 * @see Applier
 * @see Composition
 */
// ComposeNode is a special case of readonly composable and handles creating its own groups, so
// it is okay to use.
@Suppress("NONREADONLY_CALL_IN_READONLY_COMPOSABLE", "UnnecessaryLambdaCreation")
@Composable inline fun <T : Any, reified E : Applier<*>> ReusableComposeNode(
    noinline factory: () -> T,
    update: @DisallowComposableCalls Updater<T>.() -> Unit
) {
    if (currentComposer.applier !is E) invalidApplier()
    currentComposer.startReusableNode()
    if (currentComposer.inserting) {
        currentComposer.createNode(factory)
    } else {
        currentComposer.useNode()
    }
    Updater<T>(currentComposer).update()
    currentComposer.endNode()
}
```
