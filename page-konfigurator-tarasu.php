<?php
/* Template Name: konfigurator tarasu */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">
		<style>
            #podsumowanie_elementy th:nth-of-type(3) {
                display: none;
            }
            #podsumowanie_elementy td:nth-of-type(3) {
                display: none;
            }
            #podsumowanie_elementy tr:nth-of-type(7) {
                display: none;
            }
            .price_annotation{
                display: none;
            }
        </style>
        <?php require_once "konfigurator-tarasu/main.php"?>


		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
