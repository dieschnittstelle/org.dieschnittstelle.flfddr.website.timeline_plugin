<?php
/*
Plugin Name: Get author data
Description: display author data in timeline (shortcode)
Version: 1.0
*/

function handle_shortcode($atts) {
    $a = shortcode_atts(array(
        'author_id' => '',
        'author_name' => '',
        'order_pers' => '',
        'order_edu' => '',
        'order_empl' => '',
        'order_memb' => '',
        'order_litact' => '',
        'order_awards' => '',
        'order_other' => '',
        'edit_mode' => 'false'
    ), $atts );
    enqueue_scripts($a['author_id'], $a['author_name'], $a['order_pers'], $a['order_edu'],
        $a['order_empl'], $a['order_memb'], $a['order_litact'], $a['order_awards'], $a['order_other'], $a['edit_mode']);
    $htmlId = "mount" . $a['author_id'];
    return '<div id='.$htmlId.'></div>';
}
add_shortcode('authorTimeline', 'handle_shortcode');

function enqueue_scripts($authorID, $authorName, $orderPers, $orderEdu, $orderEmpl, $orderMemb, $orderLitact, $orderAwards, $orderOther, $editMode){
    global $post;
    if(has_shortcode($post->post_content, "authorTimeline")){
        wp_enqueue_script('vue', 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js', [], '2.5.17');
        wp_enqueue_script('jQuery', 'https://code.jquery.com/jquery-3.3.1.slim.min.js', [], '3.3.1');
        wp_enqueue_script('popper', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', [], '1.14.7');
        wp_enqueue_script('bootstrap', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js', [], '4.3.1');
        wp_enqueue_script('bootstrapVue', 'https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js', [], '4.3.1');
        wp_enqueue_style('bootstrapStyle', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css', [], '4.3.1');
        wp_enqueue_style('bootstrapVueStyle', 'https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css', [], '4.3.1');
        //wp_enqueue_style('timelineStyle', './vueplugin.css', [], '1.0');
    }
    //wp_enqueue_script('dataTest', plugin_dir_url( __FILE__ ) . './dataTest.js', [], '1.0', true);
    wp_register_style('timelineStyle', plugins_url('vueplugin.css',__FILE__ ));
    wp_enqueue_style('timelineStyle');
    // wp_enqueue_script('dataTest', plugin_dir_url( __FILE__ ) . './dataTest.js', [], '1.0', true);
    wp_enqueue_script('authorData', plugin_dir_url( __FILE__ ) . './vueplugin.js', [], '1.0', true);
    //wp_enqueue_script('authorData', plugin_dir_url( __FILE__ ) . './authorData.js', [], '1.0', true);
    wp_enqueue_script('bootstrapLoaded', plugin_dir_url( __FILE__ ) . './bootstrapLoaded.js', [], '1.0', true);
    wp_localize_script( 'authorData', 'par', array(
        'authorName' => ($authorName),
        'authorID' => __($authorID),
        'orderPers' => $orderPers,
        'orderEdu' => $orderEdu,
        'orderEmpl' => $orderEmpl,
        'orderMemb' => $orderMemb,
        'orderLitact' => $orderLitact,
        'orderAwards' => $orderAwards,
        'orderOther' => $orderOther,
        'editMode' => $editMode

    ));
}
