<script setup>
import { computed } from "vue";
</script>

<template>
  <div class="row">
    <ul class="pagination justify-content-center">
      <!-- <c:if test="${page gt 1}"> -->
        <li class="page-item">
          <a class="page-link" href="${root}/board/list?	page=1">처음으로</a>
        </li>
      <!-- </c:if> -->
      <!-- <c:if test="${page gt 1}"> -->
        <li class="page-item">
          <a class="page-link" href="${root}/board/list?page=${page-1}">이전</a>
        </li>
      <!-- </c:if> -->
      <!-- <c:if test="${page gt 2}"> -->
        <li class="page-item">
          <a class="page-link" href="${root}/board/list?page=${page-2}">${page - 2}</a>
        </li>
      <!-- </c:if> -->
      <!-- <c:if test="${page gt 1}"> -->
        <li class="page-item">
          <a class="page-link" href="${root}/board/list?page=${page-1}">${page - 1}</a>
        </li>
      <!-- </c:if> -->
      <li class="page-item active">
        <a class="page-link" href="#">${page}</a>
      </li>
      <!-- <c:if test="${page lt endpage}"> -->
        <li class="page-item">
          <a class="page-link" href="${root}/board/list?page=${page + 1}">${page + 1}</a>
        </li>
      <!-- </c:if> -->
      <!-- <c:if test="${page lt endpage - 1 }"> -->
        <li class="page-item">
          <a class="page-link" href="${root}/board/list?page=${page+2}">${page + 2}</a>
        </li>
      <!-- </c:if> -->
      <!-- <c:if test="${page lt endpage}"> -->
        <li class="page-item">
          <a class="page-link" href="${root}/board/list?page=${page+1}">다음</a>
        </li>
      <!-- </c:if> -->
      <!-- <c:if test="${page lt endpage}"> -->
        <li class="page-item">
          <a class="page-link" href="${root}/board/list?page=${endpage}">마지막으로</a>
        </li>
      <!-- </c:if> -->
    </ul>
  </div>
</template>

<style scoped></style>
