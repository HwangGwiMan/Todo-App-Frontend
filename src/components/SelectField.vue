<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <select
      :modelValue="modelValue"
      :class="selectClass"
      @change="handleChange"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
        <span v-if="option.isDefault" class="text-blue-600">(기본)</span>
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
  isDefault?: boolean
}

interface Props {
  modelValue: string | number | null | undefined
  label?: string
  options: Option[]
  selectClass?: string
}

withDefaults(defineProps<Props>(), {
  selectClass: 'input-field'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null | undefined]
  'change': [event: Event]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value === '' ? null : (isNaN(Number(target.value)) ? target.value : Number(target.value))
  emit('update:modelValue', value)
  emit('change', event)
}
</script>

