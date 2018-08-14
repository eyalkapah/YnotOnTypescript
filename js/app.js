"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var utilities_1 = require("./utilities");
var YnetUrlType_1 = require("./YnetUrlType");
var article_1 = require("./article");
$(document).ajaxError(function (e, jqXHR, ajaxSettings, thrownError) {
    //If either of these are true, then it's not a true error and we don't care
    if (jqXHR.status === 0 || jqXHR.readyState === 0) {
        return;
    }
    //Do Stuff Here
});
$(document).ready(function () {
    var pageType = utilities_1.default.ExtractUrl(document.URL);
    pageType = YnetUrlType_1.UrlType.Home;
    var baseUrl = "https://localhost:44320/api/articles/0,7340,L-5324848,00";
    if (pageType === YnetUrlType_1.UrlType.Home) {
        $.get({
            url: "https://localhost:44320/api/articles",
            dataType: "json",
            success: function (data) {
                var amlaks = data;
                // console.log(data);
                extractHomePage(data);
                console.log("success");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus); //error logging
            }
        });
        // $.get(, function(data, status){
        // });
    }
    else if (pageType === YnetUrlType_1.UrlType.Article) {
        // send amlak to server
        var article = extractArticle();
        var linkUrl = document.URL.substring(0, document.URL.lastIndexOf(".html"));
        var id = linkUrl.split("/").pop();
        if (id != undefined)
            article.id = id;
    }
});
function removeBanners() {
    var element = $('div[data-tb-region*="News"]').first();
    var p = element.parentsUntil("div.block.B6").last();
    var p6 = p.parent();
    var p6Closest = p6.prev("div.block.B6");
    if (p6Closest != undefined)
        p6Closest.remove();
}
function extractArticle() {
    var article = new article_1.Article();
    var titleElement = $(".art_header_title").get(0);
    article.subtitle = titleElement.innerHTML;
    var amlakElement = $(".art_header_sub_title").get(0);
    article.amlak = amlakElement.innerHTML;
    return article;
}
function extractHomePage(data) {
    removeBanners();
    extractStr3s(data);
    extractMtaPic(data);
    extractMTA(data);
}
function extractStr3s(data) {
    var heightArray = [];
    $("div.str3s_txt").each(function (index, element) {
        var article = utilities_1.default.ExtractStr3s(element);
        if (article === undefined) {
            heightArray.push(0);
            return;
        }
        var result = data.filter(function (value) { return value.id === article.id; });
        if (result.length != 1) {
            heightArray.push(0);
            return;
        }
        var amlak = result[0];
        var numOfLines = Math.ceil(amlak.amlak.length / 52);
        var height = numOfLines * 17 + 50;
        heightArray.push(height);
        // p.css("height", "120px");
        $(element).css("height", height);
        var subElement = $(element)
            .children()
            .get(1);
        //subElement.remove();
        subElement.innerHTML = amlak.amlak;
    });
    var maxHeight = Math.max.apply(Math, heightArray);
    if (maxHeight != undefined) {
        $(".str3s_small.str3s_type_small,.str3s_small.str3s_type_small > .cell,.str3s_small.str3s_type_small > .cell > a,.str3s_small.str3s_type_small > .cell > .str3s_img > img").each(function (index, element) {
            $(element).css("height", maxHeight);
        });
    }
    // $(
    //   ".str3s_small.str3s_type_small,.str3s_small.str3s_type_small > .cell,.str3s_small.str3s_type_small > .cell > a,.str3s_small.str3s_type_small > .cell > .str3s_img > img"
    // ).each((index, element) => {
    //   let height = heightReversed.pop();
    //   if (height != 0) {
    //     let s = height!.toString();
    //     if (s != undefined) {
    //       s += "px";
    //       $(element).css("height", s);
    //     }
    //   }
    // });
    // $("div.str3s_txt").each((index, element) => {
    //   let article = Helpers.ExtractStr3s(element);
    //   if (article === undefined) return;
    //   let result = data.filter(value => value.id === article!.id);
    //   if (result.length != 1) return;
    //   let amlak = result[0];
    //   let pa = $(element).closest("div.str3s_small.str3s_type_small");
    //   pa.children(
    //     ".str3s_small.str3s_type_small > .cell,.str3s_small.str3s_type_small > .cell > a,.str3s_small.str3s_type_small > .cell > .str3s_img > img"
    //   ).each((index, element) => {
    //     let height = $(element).css("height", "170px");
    //   });
    //   let p = $(element).closest(
    //     ".str3s_small.str3s_type_small,.str3s_small.str3s_type_small > .cell,.str3s_small.str3s_type_small > .cell > a,.str3s_small.str3s_type_small > .cell > .str3s_img > img"
    //   );
    //   let numOfLines = Math.ceil(amlak.amlak.length / 52);
    //   let height = numOfLines * 17 + 50;
    //   p.css("height", "120px");
    //   $(element).css("height", "170px");
    //   let subElement = $(element)
    //     .children()
    //     .get(1);
    //   //subElement.remove();
    //   subElement.innerHTML = amlak.amlak;
    // });
}
var mtaPicsArticles = [];
function extractMtaPic(data) {
    $("ul.mta_pic_items").each(function (index, element) {
        var article = utilities_1.default.ExtractMtaPic(element);
        if (article != undefined)
            mtaPicsArticles.push(article);
    });
}
function extractMTA(data) {
    var clones = [];
    $("ul.mta_items li:first-child").each(function (index, element) {
        var jElement = $(element);
        var region = jElement.attr("data-tb-owning-region-name");
        var article = mtaPicsArticles.filter(function (value) { return value.region === region; })[0];
        if (article === undefined)
            return;
        var liClone = jElement.clone(true);
        var span = liClone.find(".mta_gray_text");
        if (span != undefined)
            span.empty();
        $("ul.mta_pic_items").remove();
        var result = data.filter(function (value) { return value.id === article.id; });
        var amlak = result[0];
        amlak.amlak += amlak.amlak;
        var numOfLines = Math.ceil(amlak.amlak.length / 52);
        var height = numOfLines * 17;
        // let e = $.parseHTML(
        //   `<li class="relative_block" style="height: ${height}px;clear:both"><div>
        //   <div ><a><img style="float:right;overflow:auto;clear:both" src="${
        //     article.imgLink
        //   }"></a>
        //   </div>
        //   <div class="str3s_txt">
        //   <div class="title" style="margin-right: 10px">${article.title}</div>
        //   <div style="margin-right: 10px">${result[0].amlak}</div>
        //   </div></li>`
        // );
        var e = $.parseHTML("<div>\n      <div ><a><img style=\"float:right;overflow:auto;clear:both\" src=\"" + article.imgLink + "\"></a>\n      </div>\n     \n\n      <div class=\"str3s_txt\">\n      <div class=\"title\" style=\"margin-right: 10px\">" + article.title + "</div>\n      <div style=\"margin-right: 10px\">" + result[0].amlak + "</div>\n      \n      </div>");
        clones.push(e);
    });
    $("div.content_wrap").each(function (index, element) {
        if (index < clones.length)
            $(element).prepend(clones[index]);
    });
    $(".multiarticles.mta_4 > .content_wrap .mta_items_wrap, .multiarticles.mta_3 > .content_wrap .mta_items_wrap").each(function (index, element) {
        $(element).css("margin-right", "10px");
    });
    //let div = $(".str3s.str3s_small.str3s_type_small").first().clone();
    // $("ul.mta_items").each((index, element) => {
    //   $(element).prepend(clones[index]);
    // });
    $("ul.mta_items > li").each(function (index, element) {
        var article = utilities_1.default.ExtractMta(element);
        if (article === undefined)
            return;
        var result = data.filter(function (value) { return value.id === article.id; });
        if (result.length != 1)
            return;
        var amlak = result[0];
        if (article != undefined) {
            var subElement = $(element)
                .children()
                .get(1);
            subElement.innerHTML = amlak.amlak;
        }
    });
}
//# sourceMappingURL=app.js.map