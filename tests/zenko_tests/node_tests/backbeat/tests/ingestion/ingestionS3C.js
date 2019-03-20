const assert = require('assert');
const crypto = require('crypto');
const async = require('async');

const { scalityS3Client, ringS3Client } = require('../../../s3SDK');
const IngestionUtility = require('../../IngestionUtility');

const scalityUtils = new IngestionUtility(scalityS3Client, ringS3Client);
const ringS3CUtils = new IngestionUtility(ringS3Client);
const ingestionSrcBucket = process.env.RING_S3C_INGESTION_SRC_BUCKET_NAME;
const srcLocation = process.env.RING_S3C_BACKEND_SOURCE_LOCATION;
const ingestionDestBucket = `ingestion-dest-bucket-${Date.now()}`;
const hex = crypto.createHash('md5')
    .update(Math.random().toString())
    .digest('hex');
const keyPrefix = `${ingestionSrcBucket}/${hex}`;
const key = `${keyPrefix}/object-to-ingest-${Date.now()}`;
const ingestionKey = `${key}-ingest`;
const ingestSource = `/${ingestionSrcBucket}/${key}`;
// eslint-disable-next-line
const keyutf8 = `${keyPrefix}/%EA%9D%8崰㈌㒈保轖䳷䀰⺩ቆ楪僷ꈅꓜ퇬枅࿷염곞召㸾⌙ꪊᆐ庍뉆䌗↎幐냂詴 끴鹲萯⇂쫤ᛩ꺶㖭簹릍铰᫫暨鿐魪셑蛃춧㡡竺뫁噛̷ᗰⷑ錜⑔痴䧫㾵᏷ำꎆ꼵껪멷㄀誕㳓腜쒃컹㑻鳃삚舿췈孨੦⮀Ǌ곓⵪꺼꜈嗼뫘悕錸瑺⁤⑬১㵀⡸Ҏ礄䧛졼⮦ٞ쫁퓡垻ㆩꝿ詀펉ᆙ舑䜾힑藪碙ꀎꂰ췊Ᏻ   㘺幽醛잯ද汧Ꟑꛒⶨ쪸숞헹㭔ꡔᘼ뺓ᡆ᡾ᑟ䅅퀭耓弧⢠⇙폪ް蛧⃪Ἔ돫ꕢ븥ヲ캂䝄쟐颺ᓾ둾Ұ껗礞ᾰ瘹蒯硳풛瞋襎奺熝妒컚쉴⿂㽝㝳駵鈚䄖戭䌸᫲ᇁ䙪鸮ᐴ稫ⶭ뀟ھ⦿䴳稉ꉕ捈袿놾띐✯伤䃫⸧ꠏ瘌틳藔ˋ㫣敀䔩㭘식↴⧵佶痊牌ꪌ搒꾛æᤈべ쉴挜炩⽍舘ꆗ줣徭Z䐨 敗羥誜嘳ֶꫜ걵ࣀ묟ኋ拃秷䨸菥䟆곘縧멀煣⧃⏶혣뎧邕⢄⭖陙䣎灏ꗛ僚䌁䠒䲎둘ꪎ傩쿌ᨌ뀻阥눉넠猌ㆯ㰢船戦跏灳蝒礯鞰諾벥煸珬㟑孫鞹Ƭꄹ孙ꢱ钐삺ᓧ鈠䁞〯蘼᫩헸ῖ"`;
const INGESTION_TIMEOUT = 30000;

describe('Ingestion from RING S3C to Zenko', function() {
    afterEach(done => async.series([
        next => scalityUtils.deleteVersionedBucket(ingestionDestBucket, next),
        next => ringS3CUtils.deleteAllVersions(ingestionSrcBucket, undefined,
            next),
    ], done));

    describe('Ingesting existing data from RING S3C bucket', () => {
        it('should ingest 0-byte objects', done => async.series([
            next => ringS3CUtils.putObject(ingestionSrcBucket, key, null, next),
            next => scalityUtils.createIngestionBucket(ingestionDestBucket,
                `${srcLocation}:ingest`, next),
            next => scalityUtils.compareObjectsRINGS3C(ingestionSrcBucket,
                ingestionDestBucket, key, next),
        ], done));
    });
    //
    // describe('OOB updates for RING S3C bucket', () => {
    //     beforeEach(done => scalityUtils.createIngestionBucket(
    //         ingestionDestBucket, srcLocation, done));
    //
    //     afterEach(done => async.series([
    //         next => scalityUtils.deleteVersionedBucket(ingestionDestBucket, next),
    //         next => ringS3CUtils.deleteAllVersions(ingestionSrcBucket, undefined,
    //             next),
    //     ], done));
    //
    //     it('should receive OOB update with 0-byte object', done =>
    //     async.series([
    //         next => ringS3CUtils.putObject(ingestionSrcBucket, key, null, next),
    //         next => scalityUtils.compareObjectsRINGS3C(ingestionSrcBucket,
    //             ingestionDestBucket, key, next),
    //     ], done));
    // });
});
