<template>
  <div class="topClintInfo">
    <ul>
      <li>Test Type: {{ testType }}</li>
      <li v-show="barcodeNo">Barcode No: {{ barcodeNo }}</li>
      <li v-show="cbcPatientNo">CBC Patient No: {{ cbcPatientNo }}</li>
      <li v-show="patientName">Patient Name: {{ patientName }}</li>
      <li v-show="cbcPatientName">Patient Name: {{ cbcPatientName}}</li>
      <li v-show="cbcSex">Sex: {{ cbcSex }}</li>
      <li v-show="cbcAge">Age: {{ cbcAge }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps(['testType', 'barcodeNo', 'cbcPatientNo', 'patientName', 'hospitalName', 'cbcPatientName', 'cbcSex', 'cbcAge']);


</script>