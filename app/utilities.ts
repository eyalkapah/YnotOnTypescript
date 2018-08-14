import { Article } from "./article";
import { UrlType } from "./YnetUrlType";

export default class Helpers {
  static ExtractMtaPic(element: HTMLElement): Article | undefined {
    let ul = $(element);

    let regionName = ul
      .find("li")
      .attr("data-tb-owning-region-name");

    let linkUrl = ul.find("a.mta_pic_link").attr("href");

    if (linkUrl === undefined) return;

    let id = linkUrl
      .substring(0, linkUrl.lastIndexOf(".html"))
      .split("/")
      .pop();

    let imgLink = ul.find("img.mta_pic").attr("src");

    let title = ul.find("a.mta_title").text();

    if (
      title != undefined &&
      id != undefined &&
      linkUrl != undefined &&
      imgLink != undefined &&
      regionName != undefined
    ) {
      let article = new Article();
      article.id = id;
      article.title = title;
      article.link = linkUrl;
      article.imgLink = imgLink;
      article.region = regionName;

      return article;
    }

    return undefined;
  }

  static ExtractMta(element: HTMLElement): Article | undefined {
    let aElement = <HTMLAnchorElement>element.querySelector(".mta_title");

    if (aElement === null) return undefined;

    // if ($(element).children().length > 0) return undefined;

    let title = aElement.innerHTML;

    let linkUrl = aElement.href.substring(
      0,
      aElement.href.lastIndexOf(".html")
    );

    let id = linkUrl.split("/").pop();

    if (title != undefined && id != undefined && linkUrl != undefined) {
      let article = new Article();
      article.id = id;
      article.title = title;
      article.link = linkUrl;

      return article;
    }

    return undefined;
  }

  static ExtractStr3s(element: HTMLElement): Article | undefined {
    let titleElement = element.querySelector(".title");

    if (titleElement === null) return undefined;

    let title = titleElement.innerHTML;

    var subTitleElement = element.querySelector(".sub_title");

    if (subTitleElement === null) return undefined;

    let subtitle = subTitleElement.innerHTML;

    let linkParent = element.closest("a");

    if (linkParent != null) {
      let linkUrl = linkParent.href.substring(
        0,
        linkParent.href.lastIndexOf(".html")
      );

      let id = linkUrl.split("/").pop();

      if (
        title != undefined &&
        id != undefined &&
        linkUrl != undefined &&
        subtitle != null
      ) {
        let article = new Article();
        article.id = id;
        article.title = title;
        article.link = linkUrl;
        article.subtitle = subtitle;

        return article;
      }
    }

    return undefined;
  }

  static ExtractUrl(url: string): UrlType | undefined {
    let splittedUrl = url.split("/").filter(value => value != "");

    if (splittedUrl.length < 3) return undefined;

    if (splittedUrl[2] === "home") {
      return UrlType.Home;
    }

    if (splittedUrl[2] === "articles") {
      return UrlType.Article;
    }

    return undefined;
  }
}
