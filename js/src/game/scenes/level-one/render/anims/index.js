export default function runAnimOnSprite(entity, entityState) {
  const { anims, sprite } = entity;
  const animDef = anims[entityState];
  sprite.stop();
  sprite.textures = animDef.frames();
  if (animDef.spriteHandler) animDef.spriteHandler(sprite);
  if (animDef.onComplete) {
    sprite.onComplete = animDef.onComplete(sprite);
  }
  sprite.play();
}
