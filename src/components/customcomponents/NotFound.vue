<template>
<app-layout>
  <div class="error">
    <not-found-error  error-text="404 Page not found"
                      icon="fa fa-exclamation-circle"
    />
  </div>
</app-layout>
</template>

<script>
import NotFoundError from "@/components/customcomponents/NotFoundError";
import AppLayout from "@/AppLayout";
export default {
  components: {NotFoundError,AppLayout}
};
</script>