import * as $ from "jquery";
import Helpers from "./utilities";
import { UrlType } from "./YnetUrlType";
import { Article } from "./article";

$(document).ajaxError(function(e, jqXHR, ajaxSettings, thrownError) {
  //If either of these are true, then it's not a true error and we don't care
  if (jqXHR.status === 0 || jqXHR.readyState === 0) {
    return;
  }

  //Do Stuff Here
});

$(document).ready(() => {
  let pageType = Helpers.ExtractUrl(document.URL);

  pageType = UrlType.Home;

  let baseUrl = "https://localhost:44320/api/articles/0,7340,L-5324848,00";

  if (pageType === UrlType.Home) {
    $.get({
      url: "https://localhost:44320/api/articles",
      dataType: "json",
      success: data => {
        let amlaks = data;

        // console.log(data);
        extractHomePage(data);

        console.log("success");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus); //error logging
      }
    });
    // $.get(, function(data, status){

    // });
  } else if (pageType === UrlType.Article) {
    // send amlak to server

    let article = extractArticle();

    let linkUrl = document.URL.substring(0, document.URL.lastIndexOf(".html"));

    let id = linkUrl.split("/").pop();

    if (id != undefined) article.id = id;
  }
});

function removeBanners() {
  let element = $('div[data-tb-region*="News"]').first();
  let p = element.parentsUntil("div.block.B6").last();
  let p6 = p.parent();
  let p6Closest = p6.prev("div.block.B6");

  if (p6Closest != undefined) p6Closest.remove();
}

function extractArticle(): Article {
  let article = new Article();

  let titleElement = $(".art_header_title").get(0);

  article.subtitle = titleElement.innerHTML;

  let amlakElement = $(".art_header_sub_title").get(0);

  article.amlak = amlakElement.innerHTML;

  return article;
}

function extractHomePage(data: Array<Article>) {
  removeBanners();
  extractStr3s(data);

  extractMtaPic(data);
  extractMTA(data);
}

function extractStr3s(data: Array<Article>) {
  let heightArray: number[] = [];

  $("div.str3s_txt").each((index, element) => {
    let article = Helpers.ExtractStr3s(element);

    if (article === undefined) {
      heightArray.push(0);
      return;
    }

    let result = data.filter(value => value.id === article!.id);

    if (result.length != 1) {
      heightArray.push(0);
      return;
    }

    let amlak = result[0];

    let numOfLines = Math.ceil(amlak.amlak.length / 52);
    let height = numOfLines * 17 + 50;

    heightArray.push(height);
    // p.css("height", "120px");
    $(element).css("height", height);

    let subElement = $(element)
      .children()
      .get(1);

    //subElement.remove();

    subElement.innerHTML = amlak.amlak;
  });

  let maxHeight = Math.max(...heightArray);

  if (maxHeight != undefined) {
    $(
      ".str3s_small.str3s_type_small,.str3s_small.str3s_type_small > .cell,.str3s_small.str3s_type_small > .cell > a,.str3s_small.str3s_type_small > .cell > .str3s_img > img"
    ).each((index, element) => {
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

let mtaPicsArticles: Article[] = [];

function extractMtaPic(data: Array<Article>) {
  $("ul.mta_pic_items").each((index, element) => {
    let article = Helpers.ExtractMtaPic(element);

    if (article != undefined) mtaPicsArticles.push(article);
  });
}

function extractMTA(data: Array<Article>) {
  let clones: Array<JQuery.Node[]> = [];

  $("ul.mta_items li:first-child").each((index, element) => {
    let jElement = $(element);

    let region = jElement.attr("data-tb-owning-region-name");

    let article = mtaPicsArticles.filter(value => value.region === region)[0];

    if (article === undefined) return;

    let liClone = jElement.clone(true);

    let span = liClone.find(".mta_gray_text");

    if (span != undefined) span.empty();

    $("ul.mta_pic_items").remove();

    let result = data.filter(value => value.id === article!.id);

    let amlak = result[0];
    amlak.amlak += amlak.amlak;

    let numOfLines = Math.ceil(amlak.amlak.length / 52);
    let height = numOfLines * 17;

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

    let e = $.parseHTML(
      `<div>
      <div ><a><img style="float:right;overflow:auto;clear:both" src="${
        article.imgLink
      }"></a>
      </div>
     

      <div class="str3s_txt">
      <div class="title" style="margin-right: 10px">${article.title}</div>
      <div style="margin-right: 10px">${result[0].amlak}</div>
      
      </div>`
    );

    clones.push(e);
  });

  $("div.content_wrap").each((index, element) => {
    if (index < clones.length) $(element).prepend(clones[index]);
  });

  $(
    ".multiarticles.mta_4 > .content_wrap .mta_items_wrap, .multiarticles.mta_3 > .content_wrap .mta_items_wrap"
  ).each((index, element) => {
    $(element).css("margin-right", "10px");
  });

  //let div = $(".str3s.str3s_small.str3s_type_small").first().clone();

  // $("ul.mta_items").each((index, element) => {
  //   $(element).prepend(clones[index]);
  // });

  $("ul.mta_items > li").each((index, element) => {
    let article = Helpers.ExtractMta(element);

    if (article === undefined) return;

    let result = data.filter(value => value.id === article!.id);

    if (result.length != 1) return;

    let amlak = result[0];

    if (article != undefined) {
      let subElement = $(element)
        .children()
        .get(1);

      subElement.innerHTML = amlak.amlak;
    }
  });
}
