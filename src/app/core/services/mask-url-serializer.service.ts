import { Injectable } from '@angular/core';
import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

@Injectable()
export class MaskUrlSerializerService implements UrlSerializer {
  parse(url: string): UrlTree {
    // Your custom parsing logic here if needed.
    const defaultUrlSerializer = new DefaultUrlSerializer();
    return defaultUrlSerializer.parse(url);
  }

  serialize(tree: UrlTree): string {
    // Your custom serialization logic here if needed.
    const defaultUrlSerializer = new DefaultUrlSerializer();
    return defaultUrlSerializer.serialize(tree);
  }
}
