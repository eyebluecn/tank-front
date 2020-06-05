import BaseEntity from '../base/BaseEntity';
import Filter from '../base/filter/Filter';
import SortFilter from '../base/filter/SortFilter';
import InputFilter from '../base/filter/InputFilter';


export default class Article extends BaseEntity {

  userUuid: string | null = null;
  title: string | null = null;
  path: string | null = null;
  tags: string | null = null;
  posterTankUuid: string | null = null;
  posterUrl: string | null = null;
  author: string | null = null;
  digest: string | null = null;
  isMarkdown: boolean = true;
  html: string | null = null;
  privacy: boolean = false;
  top: boolean = false;
  agree: number = 0;
  words: number = 0;
  hit: number = 0;
  commentNum: number = 0;

  constructor(reactComponent?: React.Component) {

    super(reactComponent);

  }

  assign(obj: any) {
    super.assign(obj);


  }

  getForm(): any {
    return {
      title: this.title,
      path: this.path,
      author: this.author,
      html: this.html,
      uuid: this.uuid ? this.uuid : null,
    };
  }

  getFilters(): Filter[] {
    return [
      ...super.getFilters(),
      new InputFilter('标题', 'title'),
      new InputFilter('路径', 'path'),
      new InputFilter('作者', 'author'),
    ];
  }


}




