import { Document, Model, Query } from 'mongoose';

type QueryString = Record<string, unknown>;

class APIFeatures<T extends Document> {
  query: Query<T[], T>;
  queryString: QueryString;
  total: number | PromiseLike<number>;
  model: Model<T>;
  filterQuery: Record<string, unknown>;


  constructor(query: Query<T[], T>, model: Model<T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
    this.total = 0;
    this.model = model;
    this.filterQuery = {};
  }

  filter() {
    let queryObj: Record<string, unknown> = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // keyword
    if (typeof this.queryString.keyword === "string") {
      queryObj = { ...queryObj, $text: { $search: this.queryString.keyword } };
    }

    // 1B) Advanced filtering
    const queryStr = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.filterQuery = JSON.parse(queryStr) as Record<string, unknown>;
    this.query = this.query.find(this.filterQuery);



    return this;
  }

  count() {
    this.total = this.model.countDocuments(this.filterQuery).exec();
    return this;
  }

  sort() {
    if (typeof this.queryString.sort === "string") {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (typeof this.queryString.fields === "string") {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page =
      typeof this.queryString.page === "string"
        ? Number(this.queryString.page)
        : 1;
    const limit =
      typeof this.queryString.limit === "string"
        ? Number(this.queryString.limit)
        : 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
