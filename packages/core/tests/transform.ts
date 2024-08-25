import { clear, log } from "node:console";
import {
  Alias,
  Default,
  Field,
  FieldPrefix,
  Model,
  NoPrefix,
  ToJson,
  ToModel,
  Type,
} from "src/decorators";
import { AirAssert } from "src/helpers/AirAssert";
import { AirDateTime } from "src/helpers/AirDateTime";
import type { IJson } from "src/interfaces/IJson";
import { AirModel } from "src/models/AirModel";

const DEFAULT_PHONE_NUMBER = "13888888888";
const DEFAULT_AGE = 18;
const DEFAULT_REG_TIME = AirDateTime.getUnixTimeStamps();
const DEFAULT_WEIGHT = 150;
const DEFAULT_CLASS_NAME = "用户";
const DEFAULT_FIELD_NAME = "注册时间";
const DEFAULT_ROLE_NAME = "游客";

// 使用 Omit 工具类型排除父类或超类的属性
type ChildModelOwnProps<T, P> = Omit<T, keyof P>;

class BaseModel extends AirModel {
  id!: number;
}

type RoleModelAliasMapType = {
  [K in keyof ChildModelOwnProps<RoleModel, BaseModel>]?: string;
};
const RoleModelAliasMap: RoleModelAliasMapType = {
  name: "roleName",
};

class RoleModel extends BaseModel {
  @Alias(RoleModelAliasMap.name) name!: string;
}

// 定义不需要加前缀的字段
type NoPrefixFields = "idcard";
// 示例：使用新的类型
const user: PrefixedUserModel = {
  user_id: 1,
  user_nickname: "John",
  user_age: 30,
  user_phone: "1234567890",
  user_roleList: [],
  idcard: "ID123456", // 没有前缀
  user_weight: 70,
  user_regTime: 1627890123, // 没有前缀
};
log(user);

// 定义类型映射，将所有属性字段加上前缀，除非字段在 NoPrefixFields 中
type Prefixed<T, P extends string, N extends keyof any> = {
  [K in keyof T as K extends N ? K : `${P}${string & K}`]: T[K];
};

const USER_MODEL_PREFIX = "user_" as const;
// 使用类型映射生成新的类型
type PrefixedUserModel = Prefixed<
  ChildModelOwnProps<UserModel, AirModel>,
  typeof USER_MODEL_PREFIX,
  NoPrefixFields
>;
const UserModelAliasMap = {
  phone: "phoneNumber",
} as const;
@FieldPrefix(USER_MODEL_PREFIX)
@Model(DEFAULT_CLASS_NAME)
class UserModel extends BaseModel {
  nickname!: string;

  @Type(Number) age!: number;

  @Alias(UserModelAliasMap.phone) phone!: string;

  @Type(RoleModel, true) roleList: RoleModel[];

  @NoPrefix() idcard!: string;

  @Default(DEFAULT_WEIGHT) weight!: number;

  @ToJson((user: UserModel) => AirDateTime.formatFromSecond(user.regTime))
  @ToModel((user: IJson) =>
    AirDateTime.getUnixTimeStamps(user.regTime as unknown as string),
  )
  @Field(DEFAULT_FIELD_NAME)
  regTime!: number;
}

export function testTransform() {
  clear();
  const userModel = new UserModel();
  userModel.id = 1;
  userModel.nickname = "Hamm";
  userModel.age = DEFAULT_AGE;
  userModel.phone = DEFAULT_PHONE_NUMBER;
  userModel.idcard = "50000000000000000";
  userModel.regTime = DEFAULT_REG_TIME;

  const role = new RoleModel();
  role.name = DEFAULT_ROLE_NAME;
  userModel.roleList = [role];

  // tojson
  // const userJson = userModel.toJson<UserModel, 'idcard', typeof UserModelAliasMap>()
  const userJson = userModel.toJson() as any;
  AirAssert.when(
    userJson.user_phoneNumber !== userModel.phone,
    "transform alias failed",
  );
  AirAssert.when(
    userJson.idcard !== userModel.idcard,
    "transform prefix failed",
  );
  AirAssert.when(
    userJson.user_idcard === userModel.idcard,
    "transform prefix failed",
  );
  AirAssert.when(
    userJson.user_regTime !== AirDateTime.formatFromSecond(userModel.regTime),
    "transform toJson failed",
  );

  // change age to string
  userJson.user_age = userJson.user_age.toString();

  // toModel
  let newUserModel = UserModel.fromJson(userJson);

  AirAssert.when(
    userJson.user_roleList[0].roleName !== DEFAULT_ROLE_NAME,
    "transform model props error",
  );

  AirAssert.when(
    newUserModel.weight !== DEFAULT_WEIGHT,
    `transform 1 default value failed ${newUserModel.weight} ${userJson.weight}`,
  );
  userJson.user_weight = 200;
  newUserModel = UserModel.fromJson(userJson);

  AirAssert.when(
    newUserModel.weight !== 200,
    `transform 2 default value failed ${newUserModel.weight} ${userJson.user_weight}`,
  );

  AirAssert.when(
    newUserModel.regTime !== userModel.regTime,
    "transform toModel failed",
  );
  AirAssert.when(newUserModel.age !== userModel.age, "transform type failed");

  AirAssert.when(
    UserModel.getModelName() !== DEFAULT_CLASS_NAME,
    "decorator class name error!",
  );
  AirAssert.when(
    UserModel.getFieldName("regTime") !== DEFAULT_FIELD_NAME,
    "decorator field name error!",
  );
  AirAssert.when(
    userModel.roleList[0].name !== newUserModel.roleList[0].name,
    "transform model props error",
  );
  log("Transform test success!");
}
