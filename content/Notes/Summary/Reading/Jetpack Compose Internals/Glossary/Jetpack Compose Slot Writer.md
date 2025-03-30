---
titile: "Jetpack Compose Slot Writer"
description: "Jetpack Compose Slot Writer"
alias:
  - "Slot Writer"
  - "SlotWriter"
---

```kotlin
class SlotWriter internal constructor(table: SlotTable) : SlotEditor(table) {
    private var insertCount = 0
    private var pendingClear = false
    fun close() = table.close(this)
    /**
     * Set the value of the next slot.
     */
    fun update(value: Any?): Any? {
        val result = skip()
        set(value)
        return result
    }
    /**
     * Set the value at the current slot.
     */
    fun set(value: Any?) {
        slots[effectiveIndex(current - 1)] = value
    }
    /**
     * Skip the current slot without updating
     */
    fun skip(): Any? {
        if (insertCount > 0) {
            insert(1)
        }
        val index = current++
        return slots[table.effectiveIndex(index)]
    }
    /**
     * Backup one slot. For example, we ran into a key of a keyed group we don't want, this backs up
     * current to be before the key.
     */
    fun previous() {
        assert(current > 0) { "Invalid call to previous" }
        current--
    }
    /**
     * Begin inserting at the current location. beginInsert() can be nested and must be called with
     * a balanced number of endInsert()
     */
    fun beginInsert() {
        insertCount++
    }
    /**
     * Ends inserting.
     */
    fun endInsert() {
        assert(insertCount > 0) { "Unbalenced begin/end insert" }
        insertCount--
    }
    /**
     * Start a group
     */
    fun startGroup() = startGroup(GROUP)
    private fun startGroup(kind: GroupKind) {
        val inserting = insertCount > 0
        recordStartGroup(kind, validate = !inserting)
        if (inserting) {
            skip() // Skip a slot for the GroupStart added by endGroup.
            currentEnd = current
        }
    }
    /**
     *  Skip a group. Must be called at the start of a group.
     */
    fun skipGroup(): Int {
        assert(insertCount == 0) { "Cannot skip while inserting" }
        return advanceToNextGroup()
    }
    /**
     * End the current group. Must be called after the corresponding startGroup().
     */
    fun endGroup(): Int =
        recordEndGroup(writing = true, inserting = insertCount > 0, uncertain = false)
    /**
     * Move the offset'th group after the current item to the current location. Must be called when
     * a keyed group is expected.
     */
    fun moveItem(offset: Int) {
        assert(insertCount == 0) { "Cannot move an item while inserting" }
        val oldCurrent = current
        val oldNodeCount = nodeCount
        // Find the item to move
        var count = offset
        while (count > 0) {
            advanceToNextItem()
            count--
        }
        // Move the current one here by first inserting room for it then copying it over the spot
        // then removing the old slot.
        val moveLocation = current
        advanceToNextItem()
        val moveLen = current - moveLocation
        current = oldCurrent
        insert(moveLen)
        // insert inserted moveLen slots which moved moveLocation
        val newMoveLocation = moveLocation + moveLen
        current = oldCurrent
        nodeCount = oldNodeCount
        System.arraycopy(
            slots,
            effectiveIndex(newMoveLocation),
            slots,
            effectiveIndex(current),
            moveLen
        )
        // Before we remove the old location, move any anchors
        table.moveAnchors(newMoveLocation, current, moveLen)
        // Remove the now duplicate entries
        val anchorsRemoved = remove(moveLocation + moveLen, moveLen)
        assert(!anchorsRemoved) { "Unexpectedly removed anchors" }
    }
    /**
     * Remove an item. Must be called at the startGroup of an item.
     */
    fun removeItem(): Boolean {
        assert(insertCount == 0) { "Cannot remove and item while inserting" }
        val oldCurrent = current
        val count = advanceToNextItem()
        val anchorsRemoved = remove(oldCurrent, current - oldCurrent)
        current = oldCurrent
        nodeCount -= count
        return anchorsRemoved
    }
    /**
     * Returns an iterator for the slots of the item.
     */
    fun itemSlots(): Iterator<Any?> {
        val start = current
        val oldCount = nodeCount
        advanceToNextItem()
        val end = current
        current = start
        nodeCount = oldCount
        return object : Iterator<Any?> {
            var current = start + 2
            override fun hasNext(): Boolean = current < end
            override fun next(): Any? = slots[effectiveIndex(current++)]
        }
    }
    /**
     * Start a node.
     */
    fun startNode() = startGroup(NODE)
    /**
     * End a node
     */
    fun endNode() = endGroup()
    /**
     * Skip a node
     */
    fun skipNode() = skipGroup()
    /**
     * Skip the current item
     */
    fun skipItem(): Int {
        assert(insertCount == 0) { "Cannot skip an item while inserting" }
        return advanceToNextItem()
    }
    /**
     * Allocate an anchor for a location. As content is inserted and removed from the slot table the
     * anchor is updated to reflect those changes. For example, if an anchor is requested for an
     * item, the anchor will report the location of that item even if the item is moved in the slot
     * table. If the position referenced by the anchor is removed, the anchor location is set to -1.
     */
    fun anchor(index: Int = current): Anchor = table.anchor(index)
    private fun moveGapTo(index: Int) {
        if (table.gapLen > 0 && table.gapStart != index) {
            pendingClear = false
            if (table.anchors.isNotEmpty()) table.updateAnchors(index)
            if (index < table.gapStart) {
                val len = table.gapStart - index
                System.arraycopy(slots, index, slots, index + table.gapLen, len)
            } else {
                val len = index - table.gapStart
                System.arraycopy(
                    slots,
                    table.gapStart + table.gapLen,
                    slots,
                    table.gapStart,
                    len)
            }
            table.gapStart = index
            pendingClear = true
        } else {
            table.gapStart = index
        }
    }
    private fun insert(size: Int) {
        if (size > 0) {
            moveGapTo(current)
            if (table.gapLen < size) {
                // Create a bigger gap
                val oldCapacity = slots.size
                val oldSize = slots.size - table.gapLen
                // Double the size of the array, but at least MIN_GROWTH_SIZE and >= size
                val newCapacity = Math.max(Math.max(oldCapacity*2, oldSize + size),
                    MIN_GROWTH_SIZE
                )
                val newSlots = arrayOfNulls<Any?>(newCapacity)
                val newGapLen = newCapacity - oldSize
                val oldGapEnd = table.gapStart + table.gapLen
                val newGapEnd = table.gapStart + newGapLen
                // Copy the old array into the new array
                System.arraycopy(slots, 0, newSlots, 0, table.gapStart)
                System.arraycopy(slots, oldGapEnd, newSlots, newGapEnd, oldCapacity - oldGapEnd)
                // Update the anchors
                if (table.anchors.isNotEmpty()) table.anchorGapResize(newGapLen - table.gapLen)
                // Update the gap and slots
                table.slots = newSlots
                table.gapLen = newGapLen
            }
            if (currentEnd >= table.gapStart) currentEnd += size
            table.gapStart += size
            table.gapLen -= size
            repeat(size) {
                slots[current + it] = SlotTable.EMPTY
            }
            pendingClear = true
        }
    }
    internal fun remove(start: Int, len: Int): Boolean {
        return if (len > 0) {
            pendingClear = false
            var anchorsRemoved = false
            if (table.gapLen == 0) {
                // If there is no current gap, just make the removed items the gap
                table.gapStart = start
                if (table.anchors.isNotEmpty()) anchorsRemoved = table.removeAnchors(start, len)
                table.gapLen = len
            } else {
                // Move the gap to the startGroup + len location and set the gap startGroup to
                // startGroup and gap len to len + gapLen
                val removeEnd = start + len
                moveGapTo(removeEnd)
                if (table.anchors.isNotEmpty()) anchorsRemoved = table.removeAnchors(start, len)
                table.gapStart = start
                table.gapLen += len
            }
            if (currentEnd >= table.gapStart) currentEnd -= len
            pendingClear = true
            anchorsRemoved
        } else false
    }
    override fun toString(): String {
        if (pendingClear) {
            pendingClear = false
            table.clearGap()
        }
        return "${javaClass.simpleName}(current=$current, size=${slots.size - table.gapLen}, gap=${
        if (table.gapLen > 0) "$table.gapStart-${table.gapStart + table.gapLen - 1}" else "none"}${
        if (insertCount > 0) ", inserting" else ""})"
    }
}
```

[SlotTable.kt#385][code-slot-writer]

[code-slot-writer]: https://android.googlesource.com/platform/frameworks/support/+/f06c7ce26e29f15792b54490e4c2f77197d1222f/compose/runtime/src/main/java/androidx/compose/SlotTable.kt#385
