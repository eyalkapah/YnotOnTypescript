"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var article_1 = require("./article");
var YnetUrlType_1 = require("./YnetUrlType");
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.ExtractMtaPic = function (element) {
        var ul = $(element);
        var regionName = ul
            .find("li")
            .attr("data-tb-owning-region-name");
        var linkUrl = ul.find("a.mta_pic_link").attr("href");
        if (linkUrl === undefined)
            return;
        var id = linkUrl
            .substring(0, linkUrl.lastIndexOf(".html"))
            .split("/")
            .pop();
        var imgLink = ul.find("img.mta_pic").attr("src");
        var title = ul.find("a.mta_title").text();
        if (title != undefined &&
            id != undefined &&
            linkUrl != undefined &&
            imgLink != undefined &&
            regionName != undefined) {
            var article = new article_1.Article();
            article.id = id;
            article.title = title;
            article.link = linkUrl;
            article.imgLink = imgLink;
            article.region = regionName;
            return article;
        }
        return undefined;
    };
    Helpers.ExtractMta = function (element) {
        var aElement = element.querySelector(".mta_title");
        if (aElement === null)
            return undefined;
        // if ($(element).children().length > 0) return undefined;
        var title = aElement.innerHTML;
        var linkUrl = aElement.href.substring(0, aElement.href.lastIndexOf(".html"));
        var id = linkUrl.split("/").pop();
        if (title != undefined && id != undefined && linkUrl != undefined) {
            var article = new article_1.Article();
            article.id = id;
            article.title = title;
            article.link = linkUrl;
            return article;
        }
        return undefined;
    };
    Helpers.ExtractStr3s = function (element) {
        var titleElement = element.querySelector(".title");
        if (titleElement === null)
            return undefined;
        var title = titleElement.innerHTML;
        var subTitleElement = element.querySelector(".sub_title");
        if (subTitleElement === null)
            return undefined;
        var subtitle = subTitleElement.innerHTML;
        var linkParent = element.closest("a");
        if (linkParent != null) {
            var linkUrl = linkParent.href.substring(0, linkParent.href.lastIndexOf(".html"));
            var id = linkUrl.split("/").pop();
            if (title != undefined &&
                id != undefined &&
                linkUrl != undefined &&
                subtitle != null) {
                var article = new article_1.Article();
                article.id = id;
                article.title = title;
                article.link = linkUrl;
                article.subtitle = subtitle;
                return article;
            }
        }
        return undefined;
    };
    Helpers.ExtractUrl = function (url) {
        var splittedUrl = url.split("/").filter(function (value) { return value != ""; });
        if (splittedUrl.length < 3)
            return undefined;
        if (splittedUrl[2] === "home") {
            return YnetUrlType_1.UrlType.Home;
        }
        if (splittedUrl[2] === "articles") {
            return YnetUrlType_1.UrlType.Article;
        }
        return undefined;
    };
    return Helpers;
}());
exports.default = Helpers;
//# sourceMappingURL=utilities.js.map